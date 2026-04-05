import { AlertTriangle, X } from 'lucide-react'

interface ErrorMessageProps {
  message: string
  onClose?: () => void
}

export function ErrorMessage({ message, onClose }: ErrorMessageProps) {
  if (!message) return null

  return (
    <div className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-[rgba(239,68,68,0.38)] bg-[rgba(127,29,29,0.32)] px-4 py-3 text-[#fecaca]">
      <div className="flex items-start gap-2">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#fca5a5]" />
        <span className="text-sm leading-relaxed">{message}</span>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-[#fca5a5] transition-colors hover:bg-[rgba(127,29,29,0.35)] hover:text-[#fee2e2]"
          aria-label="Fechar erro"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
