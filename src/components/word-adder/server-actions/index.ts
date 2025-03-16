"use server"
// import { getSession } from "@/lib/auth";
import { prisma } from "@/prisma";
import { revalidatePath } from 'next/cache';

export async function insertWordCard(word: string, meaning: string, memoCardId: string) {
    // const session = await getSession();
    let newWordCard = {}

    // if (session?.user.id) {
    //     newWordCard = await prisma.word_card.create({
    //         data: {
    //             word: word,
    //             meaning: meaning,
    //             createTime: new Date(),
    //             userId: session?.user.id,
    //             memoCard_id: memoCardId,
    //         },
    //     });
    //     // revalidatePath("/word-cards")
    // }

    return JSON.stringify(newWordCard);
}
