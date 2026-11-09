import '@/app/globals.css'
import Header from '@/app/ui/header/header'
import { DictionaryProvider } from './contexts/dictionaries'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="h-dvh flex flex-col bg-gray-100">
        <Header />
        <main className="flex-1 flex flex-col min-h-0">
          <DictionaryProvider>
            {children}
          </DictionaryProvider>
        </main>
      </body>
    </html>
  )
}