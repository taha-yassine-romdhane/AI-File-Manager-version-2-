'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { MoveLeft } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="container flex max-w-md flex-col items-center text-center">
        {/* 404 SVG Illustration */}
        <div className="relative mb-8 h-48 w-48">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-full w-full text-primary"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M12 12v6" />
            <path d="M9 15h6" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-primary">404</span>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900">
          Page Not Found
        </h1>
        <p className="mb-8 text-lg text-gray-600">
          Sorry, we couldn't find the page you're looking for. Perhaps you've
          mistyped the URL or the page has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.back()}
            className="space-x-2"
          >
            <MoveLeft className="h-4 w-4" />
            <span>Go Back</span>
          </Button>
          <Link href="/">
            <Button size="lg">Return Home</Button>
          </Link>
        </div>

        {/* Help Links */}
        <div className="mt-12 flex items-center justify-center space-x-4 text-sm text-gray-500">
          <Link href="/help" className="hover:text-primary hover:underline">
            Help Center
          </Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-primary hover:underline">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}
