import { getSession } from "@/lib/auth";
import { prisma } from "@/prisma"
import DailyReportHistory from '@/components/daily-report/daily-report-history'

export default async function DailyReportHistoryPage() {
    const session = await getSession()
    if (!session?.user.id) return null

    const logsPromise = prisma.user_action_logs.findMany({
        where: {
            user_id: session?.user?.id
        }
    })

    return <DailyReportHistory logsPromise={logsPromise} />
}
