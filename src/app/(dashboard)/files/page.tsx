'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileCard } from '@/components/dashboard/file-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Grid2X2, List, Search, Upload } from 'lucide-react'

// Temporary mock data
const mockFiles = [
  {
    id: '1',
    name: 'business-proposal.pdf',
    size: '2.4 MB',
    updatedAt: new Date('2024-01-15'),
    type: 'pdf',
  },
  {
    id: '2',
    name: 'technical-documentation.pdf',
    size: '4.8 MB',
    updatedAt: new Date('2024-01-14'),
    type: 'pdf',
  },
  {
    id: '3',
    name: 'project-timeline.pdf',
    size: '1.2 MB',
    updatedAt: new Date('2024-01-13'),
    type: 'pdf',
  },
  {
    id: '4',
    name: 'financial-report-2023.pdf',
    size: '3.6 MB',
    updatedAt: new Date('2024-01-12'),
    type: 'pdf',
  },
]

export default function FilesPage() {
  const router = useRouter()
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')

  // Filter files based on search query
  const filteredFiles = mockFiles.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Sort files based on selected option
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'date':
        return b.updatedAt.getTime() - a.updatedAt.getTime()
      case 'size':
        return (
          parseFloat(a.size.split(' ')[0]) - parseFloat(b.size.split(' ')[0])
        )
      default:
        return 0
    }
  })

  const handleView = (id: string) => {
    console.log('View file:', id)
    // Implement view functionality
  }

  const handleDownload = (id: string) => {
    console.log('Download file:', id)
    // Implement download functionality
  }

  const handleDelete = (id: string) => {
    console.log('Delete file:', id)
    // Implement delete functionality
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">My Files</h1>
        <Button onClick={() => router.push('/dashboard/upload')}>
          <Upload className="mr-2 h-4 w-4" />
          Upload PDF
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-x-4 md:space-y-0">
        <div className="flex flex-1 items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="size">Size</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewType === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewType('grid')}
          >
            <Grid2X2 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewType === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewType('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Files Grid */}
      <div
        className={
          viewType === 'grid'
            ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
            : 'space-y-4'
        }
      >
        {sortedFiles.length > 0 ? (
          sortedFiles.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              onView={handleView}
              onDownload={handleDownload}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 p-12 text-center">
            <FileIcon className="mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium">No files found</h3>
            <p className="mb-4 text-sm text-gray-500">
              Upload a PDF file or try a different search term
            </p>
            <Button onClick={() => router.push('/dashboard/upload')}>
              Upload PDF
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
