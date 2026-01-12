import Link from "next/link"
import { Search, Menu, User, Bell, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { LanguageToggle } from "@/components/common/LanguageToggle"
import { createClient } from "@/lib/supabase/server"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "@/app/actions/auth"

import { cookies } from "next/headers"

const TRANSLATIONS = {
    en: {
        trending: "Trending",
        ingredients: "Ingredients",
        home: "Home",
        searchPlaceholder: "Search products...",
        login: "Log in",
        logout: "Log out",
        subscribe: "Subscribe",
        premium: "Premium Member",
        profile: "Profile",
        settings: "Settings",
        billing: "Billing"
    },
    ar: {
        trending: "عناية رائجة",
        ingredients: "المكونات",
        home: "الرئيسية",
        searchPlaceholder: "ابحث عن منتجات...",
        login: "تسجيل الدخول",
        logout: "تسجيل الخروج",
        subscribe: "اشتراك",
        premium: "عضو مميز",
        profile: "الملف الشخصي",
        settings: "الإعدادات",
        billing: "الفواتير"
    }
}

export async function Header() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const cookieStore = await cookies()
    const lang = (cookieStore.get('NEXT_LOCALE')?.value || 'en') as keyof typeof TRANSLATIONS
    const t = TRANSLATIONS[lang]

    // Get user initials for avatar
    const initials = user?.email?.substring(0, 2).toUpperCase() || "U"

    // Fetch subscription status if user exists
    let isPremium = false;
    if (user) {
        const { data: profile } = await supabase
            .from('users')
            .select('subscription_status')
            .eq('id', user.id)
            .single();
        isPremium = profile?.subscription_status === 'premium';
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center px-4">
                <div className="me-4 hidden md:flex">
                    <Link href="/" className="me-6 flex items-center space-x-2 rtl:space-x-reverse">
                        <span className={`hidden font-bold sm:inline-block text-primary text-xl ${lang === 'ar' ? 'font-arabic' : ''}`}>
                            BeautySearch
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-6 rtl:space-x-reverse text-sm font-medium">
                        <Link href="/search?q=trending" className="transition-colors hover:text-foreground/80 text-foreground/60">{t.trending}</Link>
                        <Link href="/ingredients" className="transition-colors hover:text-foreground/80 text-foreground/60">{t.ingredients}</Link>
                    </nav>
                </div>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" className="me-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="pr-0">
                        <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                        <nav className="flex flex-col space-y-4 mt-6">
                            <Link href="/" className="font-bold">{t.home}</Link>
                            <Link href="/search?q=trending">{t.trending}</Link>
                            <Link href="/ingredients">{t.ingredients}</Link>
                        </nav>
                    </SheetContent>
                </Sheet>
                <div className="flex flex-1 items-center justify-between space-x-2 rtl:space-x-reverse md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        <div className="relative">
                            <Search className="absolute start-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder={t.searchPlaceholder} className="ps-8 h-9 md:w-[300px] lg:w-[400px] rounded-full bg-secondary" />
                        </div>
                    </div>
                    <nav className="flex items-center space-x-2 rtl:space-x-reverse">
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                                            <AvatarFallback>{initials}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.user_metadata?.name || 'User'}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user.email}
                                            </p>
                                            {isPremium && <span className="text-xs text-green-500 font-bold mt-1">{t.premium}</span>}
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        {t.profile}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        {t.billing}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        {t.settings}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <form action={signOut} className="w-full">
                                            <button type="submit" className="w-full text-start flex items-center">
                                                <LogOut className="me-2 h-4 w-4" />
                                                {t.logout}
                                            </button>
                                        </form>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link href="/login">
                                <Button variant="ghost" size="sm">{t.login}</Button>
                            </Link>
                        )}
                        <LanguageToggle />
                        {!isPremium && (
                            <Button size="sm" className="rounded-full px-6 font-bold bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg hover:shadow-rose-500/25 transition-all hover:scale-105">
                                {t.subscribe}
                            </Button>
                        )}
                    </nav>
                </div>

            </div>
        </header>
    )
}

