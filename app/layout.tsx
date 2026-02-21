import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProfileProvider } from "./context/profile-context"
import { SiteChatbot } from "@/components/site-chatbot"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "./context/language-context"

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Agrolytics - Smart Farming Decisions',
  description: 'AI-powered crop recommendation system to help farmers make informed decisions based on weather, market trends, and soil conditions.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          <ProfileProvider>
            <LanguageProvider>
              <SiteHeader />
              <main className="flex-1">
                {children}
              </main>
              <SiteFooter />
              <SiteChatbot />
              <Analytics />
            </LanguageProvider>
          </ProfileProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
