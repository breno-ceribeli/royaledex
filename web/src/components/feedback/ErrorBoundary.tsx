import React, { Component, type ReactNode } from 'react'
import { AlertOctagon } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-3xl px-4 py-12">
          <div className="rounded-2xl border border-[rgba(239,68,68,0.35)] bg-[rgba(127,29,29,0.28)] p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(239,68,68,0.22)]">
              <AlertOctagon className="h-7 w-7 text-[#fca5a5]" />
            </div>

            <h1 className="mb-2 text-2xl font-bold text-[#fee2e2]">Algo deu errado</h1>
            <p className="mb-6 text-sm text-[#fecaca]">
              {this.state.error?.message || 'Erro desconhecido'}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center rounded-xl bg-[#F0C040] px-5 py-2.5 text-sm font-semibold text-[#0D1B2A] transition-colors hover:bg-[#C9A033]"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
