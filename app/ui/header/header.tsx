import Logo from "@/app/ui/header/logo"
import UserInfo from "@/app/ui/header/user_info"
import Menu from "@/app/ui/header/menu"

export default function Header() {
    return (
        <header className="h-15 shrink-0 px-4 bg-gray-200 flex justify-between items-center border-b border-gray-300">
            <Logo />
            <Menu />
            <UserInfo />
        </header >
    )
}