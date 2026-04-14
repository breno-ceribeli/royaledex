import { Link } from 'react-router-dom'
import { Crown } from 'lucide-react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'

const socialLinks = [
  { href: 'https://github.com/breno-ceribeli', label: 'GitHub', icon: FaGithub },
  { href: 'https://www.linkedin.com/in/breno-ceribeli/', label: 'LinkedIn', icon: FaLinkedin },
]

export function Footer() {
  return (
    <footer className="border-t border-[#F0C040]/20 bg-[#0A1520]">
      <div className="h-px bg-linear-to-r from-transparent via-[#F0C040]/50 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <Link to="/" className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-[#F0C040]" />
            <span className="text-lg font-bold text-white">
              Royale<span className="text-[#F0C040]">Dex</span>
            </span>
          </Link>

          <p className="text-center text-sm text-[#B0BEC5]">
            Desenvolvido por <strong className="font-semibold text-white">Breno Ceribeli</strong>
          </p>

          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon

              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="text-sm text-white transition-colors hover:text-[#F0C040]"
                >
                  <Icon className="h-5 w-5" />
                </a>
              )
            })}
          </div>
        </div>

        <div className="mt-6 border-t border-[#243B53] pt-6 text-center">
          <p className="text-xs text-[#B0BEC5]">2026 RoyaleDex. Não afiliado à Supercell.</p>
        </div>
      </div>
    </footer>
  )
}
