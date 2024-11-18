import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import fs from 'fs'
import { STORAGE_LIMIT } from '@/lib/utils'

export async function POST(request: NextRequest) {
  let uploadedFilePath: string | null = null;

  try {
    // 1. Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Get user ID and check storage limit
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { 
        id: true,
        files: {
          select: {
            size: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate current storage use
    const currentStorage = user.files.reduce((sum, file) => sum + file.size, 0)

    // 3. Get and validate file
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Check if new file would exceed storage limit
    if (currentStorage + file.size > STORAGE_LIMIT) {
      return NextResponse.json({ 
        error: 'Storage limit exceeded. Please delete some files first.' 
      }, { status: 400 })
    }

    if (!file.type.includes('pdf')) {
      return NextResponse.json({ error: 'Please upload a PDF file' }, { status: 400 })
    }

    // 4. Create upload directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true }).catch(() => {})

    // 5. Save file
    const timestamp = Date.now()
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `${timestamp}-${safeFileName}`
    const relativePath = `/uploads/${filename}`
    const fullPath = path.join(process.cwd(), 'public', 'uploads', filename)
    
    uploadedFilePath = fullPath

    const bytes = await file.arrayBuffer()
    await writeFile(fullPath, Buffer.from(bytes))

    // 6. Save to database
    const savedFile = await prisma.file.create({
      data: {
        name: file.name,
        size: file.size,
        url: relativePath,
        userId: user.id,
      },
    })

    return NextResponse.json({ 
      success: true,
      file: savedFile
    })

  } catch (error) {
    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      try {
        fs.unlinkSync(uploadedFilePath)
      } catch {
        // Ignore cleanup errors
      }
    }

    return NextResponse.json({ 
      error: 'Failed to upload file'
    }, { 
      status: 500 
    })
  }
}
