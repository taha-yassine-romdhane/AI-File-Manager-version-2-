"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { FileList } from "@/components/file-list"
import { PDFViewer } from "@/components/ui/pdf-viewer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, Clock, Calendar, HardDrive, BarChart } from "lucide-react"
import Link from "next/link"
import { StorageStats } from "@/components/storage-stats"
import { AnalyticsCard } from "@/components/analytics-card"
import { STORAGE_LIMIT } from "@/lib/utils"
import { formatDistanceToNow, format } from "date-fns"

interface File {
  id: string
  name: string
  size: number
  url: string
  createdAt: string
}

interface Analytics {
  totalFiles: number
  recentUploads: number
  oldestFile: string | null
  averageFileSize: number
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [files, setFiles] = useState<File[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [totalStorage, setTotalStorage] = useState(0)
  const [analytics, setAnalytics] = useState<Analytics>({
    totalFiles: 0,
    recentUploads: 0,
    oldestFile: null,
    averageFileSize: 0,
  })

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      const response = await fetch("/api/files")
      const data = await response.json()
      if (data.files) {
        setFiles(data.files)
        // Calculate total storage used
        const totalSize = data.files.reduce((sum: number, file: File) => sum + file.size, 0)
        setTotalStorage(totalSize)

        // Calculate analytics
        const now = new Date()
        const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        
        const recentUploads = data.files.filter(
          (file: File) => new Date(file.createdAt) > last24Hours
        ).length

        const oldestFile = data.files.length > 0 
          ? data.files.reduce((oldest: File, file: File) => 
              new Date(file.createdAt) < new Date(oldest.createdAt) ? file : oldest
            ).createdAt
          : null

        const averageSize = data.files.length > 0
          ? Math.round(totalSize / data.files.length)
          : 0

        setAnalytics({
          totalFiles: data.files.length,
          recentUploads,
          oldestFile,
          averageFileSize: averageSize,
        })
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
        // Update files list and recalculate storage
        const updatedFiles = files.filter(file => file.id !== fileId)
        setFiles(updatedFiles)
        const newTotalSize = updatedFiles.reduce((sum, file) => sum + file.size, 0)
        setTotalStorage(newTotalSize)

        if (selectedFile?.id === fileId) {
          setSelectedFile(null)
        }

        // Update analytics
        const now = new Date()
        const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        
        const recentUploads = updatedFiles.filter(
          file => new Date(file.createdAt) > last24Hours
        ).length

        const oldestFile = updatedFiles.length > 0 
          ? updatedFiles.reduce((oldest, file) => 
              new Date(file.createdAt) < new Date(oldest.createdAt) ? file : oldest
            ).createdAt
          : null

        const averageSize = updatedFiles.length > 0
          ? Math.round(newTotalSize / updatedFiles.length)
          : 0

        setAnalytics({
          totalFiles: updatedFiles.length,
          recentUploads,
          oldestFile,
          averageFileSize: averageSize,
        })
      }
    } catch (error) {
      console.error("Error deleting file:", error)
    }
  }

  const handleView = (file: File) => {
    setSelectedFile(file)
  }

  // Check if user is over storage limit
  const isOverLimit = totalStorage >= STORAGE_LIMIT

  // Calculate upload trend
  const uploadTrend = analytics.totalFiles > 0
    ? {
        value: Math.round((analytics.recentUploads / analytics.totalFiles) * 100),
        label: 'last 24h',
        positive: true
      }
    : undefined

  return (
    <div className="container py-8">
      <div className="grid gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <Button asChild disabled={isOverLimit}>
              <Link href="/dashboard/upload">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Link>
            </Button>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StorageStats usedStorage={totalStorage} />
          <AnalyticsCard
            title="Total Files"
            value={analytics.totalFiles}
            icon={FileText}
            trend={uploadTrend}
          />
          <AnalyticsCard
            title="Recent Uploads"
            value={analytics.recentUploads}
            description="Files uploaded in the last 24 hours"
            icon={Clock}
          />
          <AnalyticsCard
            title="Average File Size"
            value={analytics.averageFileSize > 0 ? `${(analytics.averageFileSize / 1024 / 1024).toFixed(1)} MB` : '0 MB'}
            icon={BarChart}
          />
          {analytics.oldestFile && (
            <AnalyticsCard
              title="Library Age"
              value={formatDistanceToNow(new Date(analytics.oldestFile))}
              description={`First file added on ${format(new Date(analytics.oldestFile), 'MMM d, yyyy')}`}
              icon={Calendar}
            />
          )}
        </div>

        {/* Files List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Files</CardTitle>
          </CardHeader>
          <CardContent>
            {isOverLimit && (
              <div className="mb-4 p-4 bg-yellow-50 text-yellow-800 rounded-lg">
                ⚠️ You've reached your storage limit. Delete some files to upload more.
              </div>
            )}
            <FileList
              files={files}
              onDelete={handleDelete}
              onView={handleView}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>

      {selectedFile && (
        <PDFViewer
          isOpen={!!selectedFile}
          onClose={() => setSelectedFile(null)}
          fileUrl={selectedFile.url}
          fileName={selectedFile.name}
        />
      )}
    </div>
  )
}
