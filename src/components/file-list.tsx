import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileIcon, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { formatBytes } from "@/lib/utils"
import { DocumentCategory } from "@/lib/classification"

interface FileItem {
  id: string
  name: string
  size: number
  url: string
  createdAt: Date
}

interface FileListProps {
  files: FileItem[]
  onDelete: (fileId: string) => void
  onView: (file: FileItem) => void
  isLoading?: boolean
}

const categoryVariants: Record<DocumentCategory, "default" | "secondary" | "success" | "info" | "warning"> = {
  Financial: "info",
  Legal: "warning",
  Technical: "secondary",
  Medical: "success",
  Educational: "default",
  Business: "info",
  Personal: "warning",
  Other: "secondary",
}

export function FileList({ files, onDelete, onView, isLoading = false }: FileListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="animate-pulse flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded" />
                <div className="space-y-2">
                  <div className="h-4 w-40 bg-gray-200 rounded" />
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="space-x-2">
                <div className="h-8 w-16 bg-gray-200 rounded" />
                <div className="h-8 w-16 bg-gray-200 rounded" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (files.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center space-y-4">
          <FileIcon className="h-12 w-12 text-gray-400" />
          <div className="space-y-2">
            <h3 className="text-lg font-medium">No files uploaded yet</h3>
            <p className="text-sm text-gray-500">
              Upload your first PDF file to get started
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {files.map((file) => (
        <Card key={file.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-2 rounded">
                <FileIcon className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h4 className="text-sm font-medium">{file.name}</h4>
                <p className="text-sm text-gray-500">
                  {formatBytes(file.size)} •{" "}
                  {formatDistanceToNow(file.createdAt, {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(file)}
              >
                View
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-600"
                onClick={() => onDelete(file.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
