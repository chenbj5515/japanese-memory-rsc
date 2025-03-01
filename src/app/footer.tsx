"use client"

export default function Footer() {
    return (
        <footer className="w-full absolute bottom-0 mt-8 mx-auto px-4 pb-16">
            {/* 底部链接 */}
            <div className="flex justify-center items-center space-x-6 text-gray-800">
                <p className="hover:text-gray-600">Bunn © 2025</p>
                <span className="text-gray-400">•</span>
                <a href="/privacy-policy" className="text-gray-400 hover:opacity-90">Terms of Use</a>
                <a href="/terms-of-service" className="text-gray-400 hover:opacity-90">Privacy Policy</a>
                <a href="/business-disclosure" className="text-gray-400 hover:opacity-90">特定商取引法に基づく表示</a>
            </div>
        </footer>
    )
}