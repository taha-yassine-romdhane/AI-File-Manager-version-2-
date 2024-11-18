'use client'

'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Cloud, File, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useRouter } from 'next/navigation'

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { toast } = useToast()
  const router = useRouter()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]

    if (!file) return

    if (!file.type.includes('pdf')) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Only PDF files are allowed',
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload file')
      }

      setUploadProgress(100)
      toast({
        title: 'Success',
        description: 'File uploaded successfully',
      })

      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
        router.push('/dashboard/files')
      }, 1000)
    } catch (error) {
      console.error('Error uploading file:', error)
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Failed to upload file',
      })
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [toast, router])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    disabled: isUploading,
  })

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Upload Files</h1>
        <p className="text-muted-foreground">
          Upload your PDF files to the dashboard
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
          ${isUploading ? 'pointer-events-none' : 'cursor-pointer hover:border-primary'}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center">
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-xl font-medium">Uploading...</span>
              </div>
              <Progress value={uploadProgress} className="w-[60%]" />
            </div>
          ) : (
            <>
              <Cloud className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <p className="text-xl font-medium">
                  Drag and drop your files here
                </p>
                <p className="text-sm text-gray-500">
                  or click to select files
                </p>
              </div>
              <Button variant="outline" className="mt-4">
                Select Files
              </Button>
              <p className="mt-2 text-xs text-gray-500">
                Only PDF files are allowed
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
