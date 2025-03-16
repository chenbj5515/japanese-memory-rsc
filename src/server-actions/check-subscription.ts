"use server"
import { getSession } from "@/lib/auth";
import { prisma } from "@/prisma";

// 定义返回类型接口
export interface SubscriptionStatus {
    isSubscribed: boolean;
    expiryTime: Date | null;
}

export async function checkSubscription(): Promise<SubscriptionStatus> {
    const session = await getSession();
    const userId = session?.user.id;

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
        return {
            isSubscribed: false,
            expiryTime: null
        };
    }

    const currentTime = new Date();
    const isSubscribed = userSubscription.end_time > currentTime;

    return {
        isSubscribed,
        expiryTime: userSubscription.end_time
    };
}
