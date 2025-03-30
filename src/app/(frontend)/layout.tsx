import React from 'react'
import { Toaster } from 'sonner'
import './styles.css'
import type { Viewport } from 'next'
import LogRocketInitializer from '@/components/LogRocketInitializer'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
}

export const metadata = {
  title: 'Beyond Oil',
  description: 'Your dashboard',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <LogRocketInitializer />
        <Toaster position="top-center" />
        <main className="bg-white">{children}</main>
      </body>
    </html>
  )
}
