"use server"
import { auth } from "@/auth";
import { prisma } from "@/prisma"

export async function insertMemoCard(originalText: string, translation: string, pronunciation: string, url: string) {
    const session = await auth();
    if (!session?.userId) {
        return null;
    }

    const newMemoCard = await prisma.memo_card.create({
        data: {
            record_file_path: "",
            original_text: originalText,
            review_times: 0,
            translation: translation,
            user_id: session?.userId,
            kana_pronunciation: pronunciation,
            create_time: new Date(),
            update_time: new Date(),
            context_url: url
        },
    });

    return JSON.stringify(newMemoCard);
}
