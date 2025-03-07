import { auth } from "@/auth"
import { TooltipProvider } from '@/components/ui/tooltip'

export default async function DailyReportLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()
    if (!session?.userId) return null

    return (
        <TooltipProvider>
            {children}
        </TooltipProvider>
    )
}
