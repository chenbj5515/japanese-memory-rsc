"use server"
import { TWordCard } from "@/app/[locale]/word-cards/page";
import { auth } from "@/auth";
import { prisma } from "@/prisma";

export async function updateForgetCount(wordCardInfo: TWordCard) {
  try {
    const session = await auth();

    if (!session?.user_id) {
      throw new Error('ユーザー未登録');
    }
  
    if (!wordCardInfo) {
      throw new Error('Word card not found');
    }

    await Promise.all([
      // 1. 更新 word_card 的 forget_count
      prisma.word_card.update({
        where: { id: wordCardInfo.id },
        data: {
          forget_count: {
            increment: 1
          }
        }
      }),

      // 2. 更新 memo_card 的 forget_count
      prisma.memo_card.update({
        where: { id: wordCardInfo.memo_card_id },
        data: {
          forget_count: {
            increment: 1
          }
        }
      })
    ]);

    return { success: true }
  } catch (error) {
    console.error('Error updating forget count:', error)
    return { success: false, error: 'Failed to update forget count' }
  }
} 