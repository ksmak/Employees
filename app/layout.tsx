import './globals.css'
import Logo from "./ui/logo";
import UserInfo from "./ui/user_info";
import Menu from "./ui/menu";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="h-dvh flex flex-col bg-gray-100">
        <header className="h-15 shrink-0 px-4 bg-gray-200 flex justify-between items-center border-b border-gray-300">
          <Logo />
          <Menu />
          <UserInfo />
        </header >
        <main className="flex-1 flex flex-col min-h-0">
          {children}
        </main>
      </body>
    </html>
  )
}