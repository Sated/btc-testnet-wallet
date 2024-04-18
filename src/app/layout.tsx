import Image from 'next/image'
import type { Metadata } from 'next'
import { ToastContainer } from 'react-toastify'
import { Inter } from 'next/font/google'
import 'react-toastify/dist/ReactToastify.css'
import './globals.css'
import { Providers } from '@/app/_components/Providers/Providers'
import type React from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bitcoin Testnet Web App',
  description:
    'This project is a minimalist Web application built using React.js, Next.js, and Redux Toolkit for the Bitcoin Testnet network. Users can create an address, view a list of transactions, and send a specified amount of bitcoins to a given Bitcoin address.',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        href: '/favicon.ico',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex items-center justify-center min-h-screen px-4">
            <main className="main">
              <div className="flex justify-center">
                <Image className="object-cover size-24 rounded-full overflow-hidden" width={90} height={90} src="/avatar.jpg" alt="" />
              </div>

              {children}
            </main>
          </div>
          <ToastContainer pauseOnHover theme="dark" />
        </Providers>
      </body>
    </html>
  )
}
