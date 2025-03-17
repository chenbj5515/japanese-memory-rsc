import { getSession } from "@/lib/auth";
import { TooltipProvider } from '@/components/ui/tooltip'

export default async function DailyReportLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getSession()
    if (!session?.user.id) return null

    return (
        <TooltipProvider>
            {children}
        </TooltipProvider>
    )
}
