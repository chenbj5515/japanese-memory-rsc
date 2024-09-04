import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const memoCards = await prisma.memo_card.findMany({
            take: 3, // 只取前 10 条
        });
        // 返回 JSON 响应
        return NextResponse.json(memoCards);
    } catch (error) {
        console.error('Error fetching memo cards:', error);
        return NextResponse.json({ error: 'Failed to fetch memo cards' }, { status: 500 });
    }
}