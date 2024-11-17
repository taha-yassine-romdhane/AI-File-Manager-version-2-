'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { Sidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return null
  }

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="relative flex min-h-screen">
      <Sidebar />
      <div className="flex-1 lg:pl-72">
        <DashboardNavbar />
        <main className="py-6 px-4 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
