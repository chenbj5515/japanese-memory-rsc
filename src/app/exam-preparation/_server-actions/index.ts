"use server"
import { auth } from "@/auth";
import { prisma } from "@/prisma"

export async function insertMemoCard() {
    const session = await auth();
    const user_id = session?.userId;
    
    if (!user_id) {
        return ""
    }
    
    const newMemoCard = await prisma.exam.create({
        data: {
            result_data: "",
            user_id,
            create_time: new Date(),
        },
    });

    return JSON.stringify(newMemoCard);
}
