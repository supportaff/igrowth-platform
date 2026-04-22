import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'iGrowth — Instagram Growth & Revenue Platform',
  description: 'Turn Instagram conversations into conversions. Automate DMs, capture leads, and track revenue — all in one platform built for creators and businesses.',
  keywords: 'instagram automation, DM automation, instagram CRM, instagram leads, creator monetization',
  openGraph: {
    title: 'iGrowth — Instagram Growth & Revenue Platform',
    description: 'Turn Instagram conversations into conversions.',
    type: 'website',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-[#0f0f1a] text-white antialiased`}>
        {children}
      </body>
    </html>
  )
}
