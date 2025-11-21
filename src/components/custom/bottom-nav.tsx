'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, Library, User, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/minhas-receitas', label: 'Minhas Receitas', icon: BookOpen },
  { href: '/biblioteca', label: 'Biblioteca', icon: Library },
  { href: '/perfil', label: 'Perfil', icon: User },
  { href: '/premium', label: 'Premium', icon: Crown },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#FAFAFA] border-t border-[#E5E5E5]">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all',
                  isActive 
                    ? 'text-[#FF7F50]' 
                    : 'text-[#505050] hover:text-[#1A1A1A]'
                )}
              >
                <Icon className={cn('w-5 h-5', isActive && 'scale-110')} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
