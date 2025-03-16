'use client'

import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const t = useTranslations('auth')

  // 错误类型映射
  const errorTypes = {
    'OAuthSignin': '登录过程中出现问题',
    'OAuthCallback': '登录回调处理失败',
    'OAuthCreateAccount': '创建账号失败',
    'EmailCreateAccount': '创建账号失败',
    'Callback': '回调处理失败',
    'OAuthAccountNotLinked': '此邮箱已通过其他方式登录',
    'EmailSignin': '发送登录邮件失败',
    'CredentialsSignin': '登录凭据无效',
    'SessionRequired': '需要登录后访问',
    'default': '认证过程中出现错误'
  }

  const errorMessage = errorTypes[error as keyof typeof errorTypes] || errorTypes.default

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="max-w-md">
        <CardHeader className="text-center">
          <CardTitle>{t('error.title')}</CardTitle>
          <CardDescription>{errorMessage}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mt-2 text-sm text-muted-foreground">
            {t('error.instruction')}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/login">
              {t('error.returnToLogin')}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 