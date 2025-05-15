
import { toast } from "@/components/ui/sonner"

export { toast }

export type ToastProps = {
  title?: string
  description?: string
  action?: React.ReactNode
}

export const useToast = () => {
  return {
    toast: ({ title, description, action, ...props }: ToastProps) => {
      toast(title, {
        description,
        action,
        ...props,
      })
    },
    toasts: [], // Added for compatibility but not used
  }
}
