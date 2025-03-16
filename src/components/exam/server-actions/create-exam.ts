"use server"
import { getSession } from "@/lib/auth";
import { prisma } from "@/prisma"

export async function createExam() {
    const session = await getSession();
    const userId = session?.user.id;
    
    if (!userId) {
        return ""
    }
    
    const newExam = await prisma.exams.create({
        data: {
            exam_name: "",
            userId,
            create_time: new Date(),
        },
    });

    return JSON.stringify(newExam);
}
