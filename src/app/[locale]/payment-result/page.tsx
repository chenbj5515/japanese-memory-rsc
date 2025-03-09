import { Zap, BadgeCheck } from "lucide-react"
import { StartJourneyButton } from "@/components/start-journey-button"

export default function PaymentSuccess() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4">
            <div className="w-[440px] h-[418px] max-w-md rounded-lg border border-gray-100 bg-white p-8 shadow-sm">
                <div className="flex flex-col items-center space-y-6">
                    {/* Logo */}
                    <div className="flex items-center space-x-2 ">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <img src="/icon/brand.png" alt="Brand logo" className="size-4" />
                        </div>
                        <span className="text-lg font-medium">Bunn</span>
                    </div>

                    {/* Success Message */}
                    <div className="flex flex-col items-center space-y-2 text-center">
                        <BadgeCheck className="h-8 w-8 text-green-500" />
                        <h1 className="text-2xl font-semibold">支付成功！</h1>
                        <p className="text-gray-600">你已经成功订阅Bunn Premium</p>
                    </div>

                    {/* Premium Feature */}
                    <div className="flex w-full items-center justify-center rounded-lg bg-gray-50 p-4">
                        <div className="flex items-center space-x-2">
                            <Zap className="h-5 w-5 text-amber-500" />
                            <p className="text-gray-700">
                                <a
                                    href="https://chromewebstore.google.com/detail/subtitle-snatcher/fpaloochihjldiaigldijhbmgjjjicoa?authuser=0&hl=zh-CN"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                >
                                    Bunn插件
                                </a>
                                的完整功能也已经解锁！
                            </p>
                        </div>
                    </div>

                    {/* Action Button */}
                    <StartJourneyButton />
                </div>
            </div>
        </div>
    )
}