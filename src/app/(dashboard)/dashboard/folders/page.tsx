'use client'

import { useState } from 'react'
import {
  Folder,
  FolderPlus,
  MoreVertical,
  Pencil,
  Trash2,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

// Mock data for folders
const mockFolders = [
  {
    id: '1',
    name: 'Business Documents',
    fileCount: 12,
    lastModified: '2024-01-15',
  },
  {
    id: '2',
    name: 'Technical Docs',
    fileCount: 8,
    lastModified: '2024-01-14',
  },
  {
    id: '3',
    name: 'Project Files',
    fileCount: 15,
    lastModified: '2024-01-13',
  },
]

export default function FoldersPage() {
  const [folders, setFolders] = useState(mockFolders)
  const [isCreating, setIsCreating] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const { toast } = useToast()

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a folder name',
      })
      return
    }

    const newFolder = {
      id: Date.now().toString(),
      name: newFolderName.trim(),
      fileCount: 0,
      lastModified: new Date().toISOString().split('T')[0],
    }

    setFolders([newFolder, ...folders])
    setNewFolderName('')
    setIsCreating(false)
    toast({
      title: 'Success',
      description: 'Folder created successfully',
    })
  }

  const handleDeleteFolder = (folderId: string) => {
    setFolders(folders.filter((folder) => folder.id !== folderId))
    toast({
      title: 'Success',
      description: 'Folder deleted successfully',
    })
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Folders</h1>
        <p className="text-muted-foreground">
          Organize your PDF files into folders
        </p>
      </div>

      <div className="mb-6">
        {isCreating ? (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Input
                  type="text"
                  placeholder="Enter folder name..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="flex-1"
                  autoFocus
                />
                <Button onClick={handleCreateFolder}>Create</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false)
                    setNewFolderName('')
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Button
            onClick={() => setIsCreating(true)}
            className="w-full"
            variant="outline"
          >
            <FolderPlus className="mr-2 h-4 w-4" />
            Create New Folder
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {folders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No folders created yet</p>
          </div>
        ) : (
          folders.map((folder) => (
            <Card key={folder.id} className="hover:bg-accent/5">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-4">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Folder className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{folder.name}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <FileText className="mr-1 h-4 w-4" />
                        {folder.fileCount} files
                      </span>
                      <span>•</span>
                      <span>
                        Modified {new Date(folder.lastModified).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost">Open</Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDeleteFolder(folder.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
