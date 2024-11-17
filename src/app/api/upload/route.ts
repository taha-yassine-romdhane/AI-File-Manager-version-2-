import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    
    if (!file) {
      return new NextResponse(
        JSON.stringify({ error: 'No file provided' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Validate file type
    if (!file.type.includes('pdf')) {
      return new NextResponse(
        JSON.stringify({ error: 'Only PDF files are supported' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Save file metadata to database
    const savedFile = await prisma.file.create({
      data: {
        name: file.name,
        size: file.size,
        type: file.type,
        userId: session.user.email,
      },
    })

    return new NextResponse(
      JSON.stringify({ 
        success: true, 
        file: savedFile
      }), 
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Upload error:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }), 
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  }
}
