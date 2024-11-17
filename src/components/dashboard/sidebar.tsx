'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  Upload,
  Settings,
  FolderOpen,
  Search,
} from 'lucide-react'

const sidebarLinks = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'My Files',
    href: '/dashboard/files',
    icon: FileText,
  },
  {
    title: 'Upload',
    href: '/dashboard/upload',
    icon: Upload,
  },
  {
    title: 'Search',
    href: '/dashboard/search',
    icon: Search,
  },
  {
    title: 'Folders',
    href: '/dashboard/folders',
    icon: FolderOpen,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r bg-white lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <div className="flex flex-shrink-0 items-center px-6">
          <Link href="/dashboard" className="flex items-center space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
            <span className="text-xl font-bold">PDF Manager</span>
          </Link>
        </div>
        <nav className="mt-8 flex-1 space-y-1 px-4">
          {sidebarLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname.startsWith(link.href)

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon
                  className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0',
                    isActive ? 'text-primary-foreground' : 'text-gray-400 group-hover:text-gray-500'
                  )}
                />
                {link.title}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
