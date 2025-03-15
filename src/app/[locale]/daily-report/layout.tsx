import { auth } from "@/auth"
import { TooltipProvider } from '@/components/ui/tooltip'

export default async function DailyReportLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()
    if (!session?.user_id) return null

    return (
        <TooltipProvider>
            {children}
        </TooltipProvider>
    )
}
