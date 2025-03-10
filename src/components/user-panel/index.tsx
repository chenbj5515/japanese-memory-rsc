"use client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from 'next-intl'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Logout } from "@/server-actions"
import { ChevronRight } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { createPortalSession } from "./server-actions/create-portal-session"

export default function UserPanel() {
    const { data } = useSession()
    const router = useRouter()
    const locale = useLocale()
    const t = useTranslations('LoginedHeader')

    const subscription_end_time = data?.subscription_end_time;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric' })
    }

    async function handleLogout() {
        await Logout()
        router.push(`/${locale}/home`)
    }

    async function handleManageSubscription() {
        try {
            const url = await createPortalSession()
            window.open(url, '_blank')
        } catch (error) {
            console.error('Failed to create portal session:', error)
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Avatar className="hidden sm:block h-10 w-10 cursor-pointer">
                    <AvatarImage src={data?.profile} alt="profile" />
                    <AvatarFallback>user</AvatarFallback>
                </Avatar>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-2 space-y-2">
                <div className="px-2 py-1.5">
                    <p className="text-sm font-medium truncate">{data?.email}</p>
                </div>
                <div className="py-1.5 flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-[8px] w-full justify-between text-sm border-none outline-none"
                        onClick={() => window.open(`/${locale}/pricing`, '_blank')}
                    >
                        <p className="text-sm font-medium">{t('membershipPlan')}</p>
                        <span className="text-sm">
                            {subscription_end_time ? 'Premium' : 'Free'}
                        </span>
                    </Button>
                </div>
                {subscription_end_time && (
                    <div className="px-2 py-1.5 flex items-center justify-between">
                        <p className="text-sm font-medium">{t('expiryDate')}</p>
                        <span className="text-sm">{formatDate(subscription_end_time)}</span>
                    </div>
                )}
                {subscription_end_time && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-[8px] w-full justify-between text-sm border-none outline-none"
                        onClick={handleManageSubscription}
                    >
                        {t('subscriptionManagement')}
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                )}
                <Separator />
                <Button
                    variant="ghost"
                    size="sm"
                    className="p-[8px] w-full justify-start text-sm"
                    onClick={handleLogout}
                >
                    {t('logout')}
                </Button>
            </PopoverContent>
        </Popover>
    )
}

