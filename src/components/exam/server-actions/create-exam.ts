"use server"
import { auth } from "@/auth";
import { prisma } from "@/prisma"

export async function createExam() {
    const session = await auth();
    const user_id = session?.userId;
    
    if (!user_id) {
        return ""
    }
    
    const newExam = await prisma.exams.create({
        data: {
            exam_name: "",
            user_id,
            create_time: new Date(),
        },
    });

    return JSON.stringify(newExam);
}
