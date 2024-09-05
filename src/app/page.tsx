import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function RootPage() {
  const session = await auth()

  if (session) {
    // 用户已登录，重定向到 /home
    redirect("/home")
  } else {
    // 用户未登录，重定向到登录页面
    redirect("/api/auth/signin")
  }
}