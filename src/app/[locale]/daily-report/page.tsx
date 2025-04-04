import DailyReport from '@/components/daily-report'
import { auth } from "@/auth"
import { prisma } from "@/prisma"
import { $Enums } from "@prisma/client"
import { askAIDirectly } from '@/server-actions'
import { getTranslations } from 'next-intl/server'

export default async function YearEndReportPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const session = await auth()
  if (!session?.userId) return null
  let id = 0
  let { date } = await searchParams;
  const t = await getTranslations('dailyReport');

  const targetDate = date ? new Date(date) : new Date()

  targetDate.setHours(0, 0, 0, 0)
  const nextDay = new Date(targetDate)
  nextDay.setDate(nextDay.getDate() + 1)

  // Get action logs for the specified date
  const actionLogs = await prisma.user_action_logs.findMany({
    where: {
      user_id: session.userId,
      create_time: {
        gte: targetDate,
        lt: nextDay
      }
    }
  })

  // Calculate stats
  const flashcards = actionLogs.filter(log => log.action_type === $Enums.action_type_enum.COMPLETE_SENTENCE_REVIEW).length
  const words = actionLogs.filter(log => log.action_type === $Enums.action_type_enum.COMPLETE_WORD_REVIEW).length

  // Calculate average exam score
  const examLogs = actionLogs.filter(log => log.action_type === $Enums.action_type_enum.COMPLETE_EXAM)
  const examResults = await prisma.exams.findMany({
    where: {
      exam_id: {
        in: examLogs.map(log => log.related_id)
      }
    },
    select: {
      total_score: true
    }
  })
  const score = examResults.length > 0 
    ? Math.round(examResults.reduce((acc, exam) => acc + exam.total_score, 0) / examResults.length)
    : 0

  // Get study items
  const studyItems = []

  // Get word meaning mistakes
  const meaningMistakes = await Promise.all(
    actionLogs
      .filter(log => log.action_type === $Enums.action_type_enum.FORGOT_WORD_MEANING)
      .map(async log => {
        const wordCard = await prisma.word_card.findUnique({
          where: { id: log.related_id },
          include: { memo_card: true }
        })
        return {
          id: id++,
          type: 'meaning',
          question: t('forgotMeaning', { word: wordCard?.word || '' }),
          answer: `${wordCard?.meaning.replaceAll("意味：", "")}`,
          memo_card: wordCard?.memo_card
        }
      })
  )
  studyItems.push(...meaningMistakes)

  // Get pronunciation mistakes  
  const pronunciationMistakes = await Promise.all(
    actionLogs
      .filter(log => log.action_type === $Enums.action_type_enum.FORGOT_WORD_PRONUNCIATION)
      .map(async log => {
        const wordCard = await prisma.word_card.findUnique({
          where: { id: log.related_id },
          include: { memo_card: true }
        })
        const { output } = await askAIDirectly(`これは日本語の単語またはフレーズです：${wordCard?.word}、それをひらがなで表記してください、気をつけて原文とか余分な言葉を出さないで、ひらがなだけを出してください。`);

        return {
          id: id++,
          type: 'pronunciation',
          question: t('forgotPronunciation', { word: wordCard?.word || '' }),
          answer: `${wordCard?.word}(${output})`,
          memo_card: wordCard?.memo_card
        }
      })
  )
  studyItems.push(...pronunciationMistakes)

  // Get expression mistakes
  const expressionMistakes = await Promise.all(
    actionLogs
      .filter(log => log.action_type === $Enums.action_type_enum.UNKNOWN_PHRASE_EXPRESSION)
      .map(async log => {
        const wordCard = await prisma.word_card.findUnique({
          where: { id: log.related_id },
          include: { memo_card: true }
        })
        return {
          id: id++,
          type: 'expression',
          question: t('forgotExpression', { meaning: wordCard?.meaning.replaceAll("意味：", "") || '' }),
          answer: wordCard?.word || '',
          memo_card: wordCard?.memo_card
        }
      })
  )
  studyItems.push(...expressionMistakes)

  // Get listening mistakes
  const listeningMistakes = await Promise.all(
    actionLogs
      .filter(log => log.action_type === $Enums.action_type_enum.UNABLE_TO_UNDERSTAND_AUDIO)
      .map(async log => {
        const memoCard = await prisma.memo_card.findUnique({
          where: { id: log.related_id }
        })
        return {
          id: id++,
          type: 'listening',
          question: t('unableToUnderstand'),
          answer: memoCard?.original_text || '',
          memo_card: memoCard
        }
      })
  )
  studyItems.push(...listeningMistakes)

  const reportData = {
    date: targetDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    stats: {
      flashcards,
      words,
      score
    },
    studyItems
  }

  return <DailyReport data={reportData} />
}
