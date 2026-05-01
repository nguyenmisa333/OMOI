import { ReactNode } from 'react'

export const metadata = {
  title: 'OMOI · 思い | Links',
  description: 'Alle wichtigen Links von OMOI — Japanese Café & Matcha Bar in Stuttgart',
}

export default function LinksLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      {children}
    </>
  )
}
