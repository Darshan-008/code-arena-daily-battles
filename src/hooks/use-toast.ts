
import { toast } from "@/components/ui/sonner"

export { toast }

export type ToastProps = {
  description?: string
  action?: React.ReactNode
}

export const useToast = () => {
  return {
    toast: ({ description, action, ...props }: ToastProps) => {
      toast("Notification", {
        description,
        action,
        ...props,
      })
    },
    toasts: [], // Added for compatibility but not used
  }
}
