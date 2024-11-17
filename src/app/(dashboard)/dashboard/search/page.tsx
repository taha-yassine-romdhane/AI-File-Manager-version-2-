'use client'

import { useState } from 'react'
import { Search as SearchIcon, FileText, SortAsc, SortDesc } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'

// Mock data for search results
const mockFiles = [
  {
    id: '1',
    name: 'business-proposal.pdf',
    size: '2.4 MB',
    lastModified: '2024-01-15',
    tags: ['business', 'proposal'],
  },
  {
    id: '2',
    name: 'technical-documentation.pdf',
    size: '4.8 MB',
    lastModified: '2024-01-14',
    tags: ['technical', 'docs'],
  },
  {
    id: '3',
    name: 'project-timeline.pdf',
    size: '1.2 MB',
    lastModified: '2024-01-13',
    tags: ['project', 'timeline'],
  },
]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [searchResults, setSearchResults] = useState(mockFiles)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // Filter files based on search query
    const filteredFiles = mockFiles.filter((file) =>
      file.name.toLowerCase().includes(query.toLowerCase()) ||
      file.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
    )
    setSearchResults(filteredFiles)
  }

  const handleSort = (value: string) => {
    setSortBy(value)
    const sortedFiles = [...searchResults].sort((a, b) => {
      if (value === 'name') {
        return sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      } else if (value === 'date') {
        return sortOrder === 'asc'
          ? new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime()
          : new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
      }
      return 0
    })
    setSearchResults(sortedFiles)
  }

  const toggleSortOrder = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc'
    setSortOrder(newOrder)
    handleSort(sortBy)
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Search Files</h1>
        <p className="text-muted-foreground">
          Search through your PDF files by name or tags
        </p>
      </div>

      <div className="mb-6 flex items-center space-x-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortBy} onValueChange={handleSort}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Sort by Name</SelectItem>
            <SelectItem value="date">Sort by Date</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSortOrder}
          className="h-10 w-10"
        >
          {sortOrder === 'asc' ? (
            <SortAsc className="h-4 w-4" />
          ) : (
            <SortDesc className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="space-y-4">
        {searchResults.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No files found</p>
          </div>
        ) : (
          searchResults.map((file) => (
            <Card key={file.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-4">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{file.size}</span>
                      <span>•</span>
                      <span>
                        {new Date(file.lastModified).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center space-x-2">
                      {file.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <Button variant="ghost">View</Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
