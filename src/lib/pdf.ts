import pdfParse from 'pdf-parse'

// Configure PDF.js worker
if (typeof window === 'undefined') {
  // Server-side
  // pdfjs.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/build/pdf.worker.js')
}

// Custom canvas factory that doesn't require the canvas package
// const NodeCanvasFactory = {
//   create(width: number, height: number) {
//     return {
//       width,
//       height,
//       style: {},
//       getContext: () => null,
//       toDataURL: () => '',
//     }
//   },
//   reset() {},
//   destroy() {},
// }

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer, {
      max: 5, // Only process first 5 pages
      version: 'v2.0.550'
    })
    
    return data.text.trim()
  } catch (error) {
    console.error('Error extracting text from PDF:', error)
    return ''
  }
}
