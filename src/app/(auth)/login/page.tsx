import { LoginButtons } from "@/components/auth/login-buttons"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome back</h1>
        </div>
        <LoginButtons />
      </div>
    </div>
  )
} 