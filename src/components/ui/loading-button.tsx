import React from 'react'
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
}

export default function LoadingButton({ isLoading = false, disabled, children, ...props }: LoadingButtonProps) {
  return (
    <Button 
      disabled={disabled || isLoading} 
      className="flex items-center justify-center space-x-2 min-w-[120px]"
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      <span>はい</span>
    </Button>
  )
}

