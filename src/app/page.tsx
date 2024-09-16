import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function RootPage() {
  const session = await auth()

  if (session) {
    redirect("/latest")
  } else {
    redirect("/api/auth/signin")
  }
}