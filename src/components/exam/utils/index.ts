import { TWordCard } from "@/app/[locale]/word-cards/page";
import { askAI } from "@/server-actions";
import { readStreamableValue } from 'ai/rsc';
import { ExamInfo } from "..";
import { $Enums } from "@prisma/client";

export function mergeResultsByQuestion(results: ExamInfo[]) {
    const questionMap = new Map<string, { question: string; wordCard?: TWordCard | null; inputs: ExamInfo[] }>();

    results.forEach(result => {
        const { question, wordCard } = result;
        if (!questionMap.has(question)) {
            questionMap.set(question, {
                question,
                wordCard,
                inputs: [result],
            });
        } else {
            questionMap.get(question)!.inputs.push(result);
        }
    });

    return Array.from(questionMap.values()) as ExamInfo[];
}

export async function checkAnswer(question: string, userAnswer: string, type: $Enums.question_type_enum): Promise<boolean> {
    if (!userAnswer) return false;
    const prompt = type === $Enums.question_type_enum.kana_from_japanese
        ? `「${question}」的平假名读音是「${userAnswer}」吗？返回true或false。`
        : type === $Enums.question_type_enum.translation_from_japanese
            ? `「${question}」对应的中文如果翻译为「${userAnswer}」你觉得可以算对吗？只返回true或false。`
            : `「${question}」对应的日文如果翻译为「${userAnswer}」你觉得可以算对吗？返回true或false。`;

    const { output } = await askAI(prompt, 0.9);
    let result = "";
    for await (const delta of readStreamableValue(output)) {
        if (delta) result += delta;
    }
    return result.trim() === "true";
}