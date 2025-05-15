
import { toast as sonnerToast } from "@/components/ui/sonner"

export type ToastProps = {
  description?: string
  action?: React.ReactNode
}

export const useToast = () => {
  return {
    toast: ({ description, action, ...props }: ToastProps) => {
      sonnerToast("Notification", {
        description,
        action,
        ...props,
      })
    },
    toasts: [], // Added for compatibility but not used
  }
}

export const toast = ({ description, action, ...props }: ToastProps) => {
  sonnerToast("Notification", {
    description, 
    action,
    ...props
  });
}
