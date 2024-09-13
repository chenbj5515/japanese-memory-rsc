"use server"
import { auth } from "@/auth";
import { prisma } from "@/prisma"

export async function insertWordCard(word: string, meaning: string, memoCardId: string) {
    const session = await auth();
    let newWordCard = {}

    if (session?.userId) {
         newWordCard = await prisma.word_card.create({
            data: {
                word: word,
                meaning: meaning,
                create_time: new Date(),
                user_id: session?.userId,
                memo_card_id: memoCardId,
            },
        });
    }

    return JSON.stringify(newWordCard);
}
