interface ErrorMessageProps {
  message: string
  onClose?: () => void
}

export function ErrorMessage({ message, onClose }: ErrorMessageProps) {
  if (!message) return null

  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg 
                    flex justify-between items-center mb-4">
      <span>{message}</span>
      {onClose && (
        <button 
          onClick={onClose}
          className="ml-3 text-red-700 hover:text-red-900 text-lg leading-none"
        >
          ✕
        </button>
      )}
    </div>
  )
}
