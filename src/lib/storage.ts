import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

const UPLOAD_DIR = path.join(process.cwd(), 'uploads')

// Ensure uploads directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

export async function saveFile(file: File, fileId: string): Promise<string> {
  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${fileId}-${safeFileName}`
    const filePath = path.join(UPLOAD_DIR, fileName)
    
    await fs.promises.writeFile(filePath, buffer)
    
    // Return the URL that will be used to access the file
    return `/api/files/${fileId}`
  } catch (error) {
    console.error('Error saving file:', error)
    throw new Error('Failed to save file')
  }
}

export function getStorageFileName(fileId: string, originalName: string): string {
  const safeFileName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_')
  return `${fileId}-${safeFileName}`
}

export async function deleteFile(fileId: string, originalName: string): Promise<void> {
  try {
    const fileName = getStorageFileName(fileId, originalName)
    const filePath = path.join(UPLOAD_DIR, fileName)
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath)
    }
  } catch (error) {
    console.error('Error deleting file:', error)
    throw new Error('Failed to delete file')
  }
}
