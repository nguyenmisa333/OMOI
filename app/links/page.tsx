'use client'

import { useState, useEffect } from 'react'

interface SocialLink {
  id: string
  title: string
  url: string
  icon: string
  sortOrder: number
  isActive: boolean
}

export default function LinksPage() {
  const [links, setLinks] = useState<SocialLink[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/links')
      .then(r => r.json())
      .then(d => setLinks(d.links || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img
          src="/images/linktree-bg.jpg"
          alt="OMOI Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 py-12">
        {/* Profile */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full overflow-hidden border-3 border-white/40 shadow-xl mx-auto mb-4 ring-2 ring-white/20 ring-offset-2 ring-offset-transparent">
            <img
              src="/images/omoi-avatar.png"
              alt="OMOI"
              className="w-full h-full object-cover"
            />
          </div>
          <h1
            className="text-3xl font-bold text-white mb-1"
            style={{ textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}
          >
            OMOI · 思い
          </h1>
          <p
            className="text-white/80 text-sm max-w-xs mx-auto leading-relaxed"
            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}
          >
            Japanese Café & Matcha Bar 🍵
            <br />
            Hauptstätter Str. 57 · Stuttgart
          </p>

          {/* Social icons */}
          <div className="flex justify-center gap-4 mt-4">
            <a
              href="https://www.instagram.com/omoi.stuttgart/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 transition-all hover:scale-110"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@omoide57"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 transition-all hover:scale-110"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.51a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.43v-7.15a8.16 8.16 0 005.58 2.2V11.2a4.85 4.85 0 01-2.65-.78l-.01.01V6.69h2.66z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Links */}
        <div className="w-full max-w-md space-y-3">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          ) : (
            links.map((link, i) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block w-full px-6 py-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg hover:bg-white hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-center"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className="text-[#3b1f0a] font-semibold text-[15px] group-hover:text-amber-800 transition-colors">
                  {link.title}
                </span>
              </a>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p
            className="text-white/50 text-xs"
            style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
          >
            © {new Date().getFullYear()} OMOI · 思い
          </p>
        </div>
      </div>
    </div>
  )
}
