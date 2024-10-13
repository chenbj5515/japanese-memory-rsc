"use server"
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { revalidatePath, revalidateTag } from 'next/cache';

export async function insertWordCard(word: string, meaning: string, memoCardId: string, isRandom: boolean) {
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
        if (!isRandom) {
            revalidatePath("/word-cards")
        }
        // revalidateTag("wordCards")
    }

    return JSON.stringify(newWordCard);
}
