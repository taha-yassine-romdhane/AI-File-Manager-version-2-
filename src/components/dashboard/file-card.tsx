'use client'

import { formatDistanceToNow } from 'date-fns'
import { FileIcon, MoreVertical, Download, Trash, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface FileCardProps {
  file: {
    id: string
    name: string
    size: string
    updatedAt: Date
    type: string
  }
  onView: (id: string) => void
  onDownload: (id: string) => void
  onDelete: (id: string) => void
}

export function FileCard({ file, onView, onDownload, onDelete }: FileCardProps) {
  return (
    <div className="group relative flex items-center justify-between space-x-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center space-x-4">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-2">
          <FileIcon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{file.name}</h3>
          <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
            <span>{file.size}</span>
            <span>•</span>
            <span>Updated {formatDistanceToNow(file.updatedAt, { addSuffix: true })}</span>
          </div>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onView(file.id)}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDownload(file.id)}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onDelete(file.id)}
            className="text-red-600"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
