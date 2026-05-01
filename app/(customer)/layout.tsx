'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import BottomNav from '@/components/shared/BottomNav'

const navLinks = [
  { href: '/', icon: 'home', label: 'Startseite' },
  { href: '/booking', icon: 'event_seat', label: 'Reservieren' },
  { href: '/account', icon: 'history', label: 'Verlauf' },
  { href: '/kontakt', icon: 'call', label: 'Kontakt' },
  { href: '/ueber-uns', icon: 'info', label: 'Über uns' },
  { href: '/impressum', icon: 'gavel', label: 'Impressum' },
  { href: '/datenschutz', icon: 'shield', label: 'Datenschutz' },
]

export default function CustomerLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isConfirmPage = pathname?.startsWith('/booking/confirm')
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* Top AppBar */}
      {!isConfirmPage && (
        <header className="fixed top-0 w-full z-50 bg-stone-50/80 backdrop-blur-md border-b border-stone-200 shadow-sm">
          <div className="flex items-center justify-between px-4 h-16 w-full max-w-7xl mx-auto">
            {isHome ? (
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="material-symbols-outlined text-stone-900 hover:bg-stone-100 transition-colors p-2 rounded-full active:scale-95 duration-200 md:hidden"
              >
                {menuOpen ? 'close' : 'menu'}
              </button>
            ) : (
              <Link
                href="/"
                className="material-symbols-outlined text-stone-900 hover:bg-stone-100 transition-colors p-2 rounded-full active:scale-95 duration-200"
              >
                arrow_back
              </Link>
            )}
            <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
              <img src="/images/omoi-avatar.png" alt="OMOI" className="w-8 h-8 rounded-full" />
              {isHome && (
                <img src="/images/omoi-logo.png" alt="OMOI" className="h-6 object-contain" />
              )}
              {!isHome && pathname?.includes('/booking') && (
                <span className="text-sm font-bold text-stone-900 uppercase tracking-widest">RESERVIERUNG</span>
              )}
              {!isHome && pathname?.includes('/account') && (
                <span className="text-sm font-bold text-stone-900 uppercase tracking-widest">VERLAUF</span>
              )}
              {!isHome && pathname?.includes('/kontakt') && (
                <span className="text-sm font-bold text-stone-900 uppercase tracking-widest">KONTAKT</span>
              )}
              {!isHome && pathname?.includes('/ueber-uns') && (
                <span className="text-sm font-bold text-stone-900 uppercase tracking-widest">ÜBER UNS</span>
              )}
            </Link>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-stone-200 bg-surface-container md:hidden">
              <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined">person</span>
              </div>
            </div>
            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.slice(0, 5).map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    (item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href))
                      ? 'bg-amber-100 text-amber-900'
                      : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
      )}

      {/* Mobile slide-down menu */}
      {menuOpen && !isConfirmPage && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
            onClick={() => setMenuOpen(false)}
          />
          <div className="fixed top-16 left-0 right-0 z-40 bg-stone-50 border-b border-stone-200 shadow-xl rounded-b-2xl md:hidden animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col p-3 gap-1">
              {navLinks.map((item) => {
                const isActive = item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href)
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all active:scale-[0.98] ${
                      isActive
                        ? 'bg-amber-100 text-amber-900'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className={isConfirmPage ? '' : 'pt-16 pb-24 md:pb-8'}>
        {children}
      </main>

      {/* Bottom Navigation */}
      {!isConfirmPage && <BottomNav />}
    </div>
  )
}
