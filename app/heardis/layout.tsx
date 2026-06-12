import { ReactNode } from 'react'

export const metadata = {
  title: 'O·MO·I · 思い | Event-Speisekarte',
  description: 'Event-Speisekarte von O·MO·I — Japanese Café & Matcha Bar in Stuttgart',
  robots: 'noindex, follow',
}

export default function HeardisLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
