"use client"
import { Suspense } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { TooltipProvider } from '@/components/ui/tooltip';
import { $Enums, Prisma } from '@prisma/client';
import { use } from 'react';
import Loading from '@/app/[locale]/loading';
import { ReportItem } from './report-item';

interface MonthData {
    month: string;
    dates: string[];
}

interface IProps {
    logsPromise: Prisma.PrismaPromise<{
        id: string;
        user_id: string;
        action_type: $Enums.action_type_enum;
        related_id: string;
        related_type: $Enums.related_type_enum;
        create_time: Date;
    }[]>
}

function processLogsData(logs: Awaited<IProps['logsPromise']>): MonthData[] {
    const dateMap = new Map<string, Set<string>>();

    // 按月份收集日期
    logs.forEach(log => {
        const date = log.create_time;
        const monthKey = `${date.getFullYear()}年${date.getMonth() + 1}月`;
        const dateStr = date.toISOString().split('T')[0];

        if (!dateMap.has(monthKey)) {
            dateMap.set(monthKey, new Set());
        }
        dateMap.get(monthKey)?.add(dateStr);
    });

    // 转换成数组格式
    const monthlyData: MonthData[] = Array.from(dateMap).map(([month, dates]) => ({
        month,
        dates: Array.from(dates).sort()
    }));

    // 按月份倒序排序
    return monthlyData.sort((a, b) => b.month.localeCompare(a.month));
}

function DailyReportContent({ logsPromise }: IProps) {
    const logs = use(logsPromise);
    const monthlyData = processLogsData(logs);

    return (
        <div className="max-w-[768px] m-auto p-4">
            <h2 className="text-xl font-semibold mb-4">レポート歴史</h2>
            <div className="rounded-md border p-4">
                <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                    {monthlyData.map((monthData, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger>{monthData.month}</AccordionTrigger>
                            <AccordionContent>
                                <ul className="space-y-2">
                                    {monthData.dates.map((date) => (
                                        <ReportItem date={date} key={date} />
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    )
}

export default function DailyReportHistory(props: IProps) {
    return (
        <TooltipProvider>
            <Suspense fallback={<Loading />}>
                <DailyReportContent {...props} />
            </Suspense>
        </TooltipProvider>
    )
}
