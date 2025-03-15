import { auth } from "@/auth"
import { prisma } from "@/prisma"
import DailyReportHistory from '@/components/daily-report/daily-report-history'

export default async function DailyReportHistoryPage() {
    const session = await auth()
    if (!session?.user_id) return null

    const logsPromise = prisma.user_action_logs.findMany({
        where: {
            user_id: session.user_id
        }
    })

    return <DailyReportHistory logsPromise={logsPromise} />
}
