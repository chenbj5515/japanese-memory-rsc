import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-blue-900 dark:to-blue-800">
      <div className="px-4 py-16 mx-auto text-center lg:px-8 sm:py-24 lg:py-32">
        <div className="flex justify-center">
          <div className="relative mb-[20px] rounded-full px-3 py-1 text-sm leading-6 text-black dark:text-white">
          </div>
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-black dark:text-white sm:text-5xl">
          ページが見つかりません
        </h1>
        <p className="mt-6 text-base leading-7 text-black dark:text-white">
          申し訳ありませんが、お探しのページは見つかりませんでした。
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/"
            className="group flex items-center justify-center rounded-md bg-black dark:bg-white px-3.5 py-2.5 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-gray-800 dark:hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white transition-all duration-200 ease-in-out"
          >
            <svg
              className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            ホームページに戻る
          </Link>
        </div>
      </div>
    </div>
  )
}