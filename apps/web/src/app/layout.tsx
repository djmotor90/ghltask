import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Task Management - GHL',
  description: 'Manage tasks like ClickUp, integrated with GoHighLevel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
