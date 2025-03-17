import { auth } from "@/auth";
import { prisma } from "@/prisma";

export async function checkSubscription(): Promise<boolean> {
    const session = await auth();
    const userId = session?.userId;

    if (!userId) {
        throw new Error("用户未登录");
    }

    const userSubscription = await prisma.user_subscription.findFirst({
        where: {
            user_id: userId,
        },
        select: {
            end_time: true,
        },
    });

    if (!userSubscription) {
        return false;
    }

    const currentTime = new Date();
    const isValid = userSubscription.end_time > currentTime;

    return isValid;
}
