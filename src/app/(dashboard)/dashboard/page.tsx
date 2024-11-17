"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { FileList } from "@/components/file-list"
import { PDFViewer } from "@/components/ui/pdf-viewer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Search, FolderIcon, Settings2 } from "lucide-react"
import Link from "next/link"

interface File {
  id: string
  name: string
  size: number
  createdAt: string
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [files, setFiles] = useState<File[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      const response = await fetch("/api/files")
      const data = await response.json()
      if (data.files) {
        setFiles(data.files)
      }
    } catch (error) {
      console.error("Error fetching files:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (fileId: string) => {
    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId))
      }
    } catch (error) {
      console.error("Error deleting file:", error)
    }
  }

  const handleView = (file: File) => {
    setSelectedFile(file)
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
        <p className="text-muted-foreground">
          Here's a list of your uploaded PDF files
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/upload">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upload File</CardTitle>
              <Upload className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Upload a new PDF file
              </p>
            </CardContent>
          </Card>
        </Link>

        <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Search Files</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Search through your files
            </p>
          </CardContent>
        </Card>

        <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manage Folders</CardTitle>
            <FolderIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Organize your files in folders
            </p>
          </CardContent>
        </Card>

        <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Settings</CardTitle>
            <Settings2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Manage your preferences
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Files List */}
      <div>
        <FileList
          files={files}
          onDelete={handleDelete}
          onView={handleView}
          isLoading={isLoading}
        />
      </div>

      {/* PDF Viewer Modal */}
      {selectedFile && (
        <PDFViewer
          isOpen={!!selectedFile}
          onClose={() => setSelectedFile(null)}
          fileUrl={`/api/files/${selectedFile.id}`}
          fileName={selectedFile.name}
        />
      )}
    </div>
  )
}
