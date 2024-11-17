import { HfInference } from '@huggingface/inference'

// Initialize Hugging Face client
const hf = new HfInference(process.env.HUGGING_FACE_API_KEY)

// Document categories we want to support
export type DocumentCategory = 
  | 'Financial' 
  | 'Legal' 
  | 'Technical' 
  | 'Medical' 
  | 'Educational' 
  | 'Business' 
  | 'Personal'
  | 'Other'

export async function classifyDocument(text: string): Promise<DocumentCategory[]> {
  try {
    // If text is empty, return Other
    if (!text || text.trim().length === 0) {
      console.log('No text content to classify')
      return ['Other']
    }

    console.log('Starting document classification...')
    
    // Truncate text if it's too long (API limit)
    const maxLength = 1024
    const truncatedText = text.slice(0, maxLength)

    // Using facebook/bart-large-mnli for zero-shot classification
    const response = await hf.zeroShotClassification({
      model: 'facebook/bart-large-mnli',
      inputs: truncatedText,
      parameters: {
        candidate_labels: [
          'Financial document',
          'Legal document',
          'Technical documentation',
          'Medical record',
          'Educational material',
          'Business document',
          'Personal document'
        ],
        multi_label: true
      }
    })

    console.log('Classification response:', response)

    // Map the results to our categories and filter by confidence
    const categories: DocumentCategory[] = []
    const CONFIDENCE_THRESHOLD = 0.3

    response.labels.forEach((label, index) => {
      if (response.scores[index] >= CONFIDENCE_THRESHOLD) {
        if (label.includes('Financial')) categories.push('Financial')
        else if (label.includes('Legal')) categories.push('Legal')
        else if (label.includes('Technical')) categories.push('Technical')
        else if (label.includes('Medical')) categories.push('Medical')
        else if (label.includes('Educational')) categories.push('Educational')
        else if (label.includes('Business')) categories.push('Business')
        else if (label.includes('Personal')) categories.push('Personal')
      }
    })

    console.log('Detected categories:', categories)
    return categories.length > 0 ? categories : ['Other']
  } catch (error) {
    console.error('Error classifying document:', error)
    // Check if it's an API key error
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      console.error('Invalid or missing Hugging Face API key')
    }
    return ['Other']
  }
}
