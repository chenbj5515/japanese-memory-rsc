import DailyReport from '@/components/daily-report'
import { auth } from "@/auth"
import { prisma } from "@/prisma"
import { $Enums } from "@prisma/client"

export default async function YearEndReportPage() {
  const session = await auth()
  if (!session?.userId) return null
  let id = 0

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Get action logs for today
  const actionLogs = await prisma.user_action_logs.findMany({
    where: {
      user_id: session.userId,
      create_time: {
        gte: today,
        lt: tomorrow
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
          where: { id: log.related_id }
        })
        return {
          id: id++,
          type: 'meaning',
          question: `「${wordCard?.word}」の意味を忘れました、今覚えていますか？`,
          answer: `${wordCard?.meaning.replaceAll("意味：", "")}`
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
          where: { id: log.related_id }
        })
        return {
          id: id++,
          type: 'pronunciation',
          question: `「${wordCard?.word}」の発音を忘れました、今覚えていますか？`,
          answer: `()`
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
          where: { id: log.related_id }
        })
        return {
          id: id++,
          type: 'expression',
          question: `「${wordCard?.meaning.replaceAll("意味：", "")}」の日本語で表現する方法を忘れました、今覚えていますか？`,
          answer: wordCard?.word || ''
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
          question: 'この文を聞き取れませんでした：',
          answer: memoCard?.original_text || '',
          audioSrc: memoCard?.record_file_path
        }
      })
  )
  studyItems.push(...listeningMistakes)

  const reportData = {
    date: today.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    stats: {
      flashcards,
      words,
      score
    },
    studyItems
  }

  return <DailyReport data={reportData} />
}
