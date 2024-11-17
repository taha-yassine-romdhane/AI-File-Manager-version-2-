import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface PDFViewerProps {
  isOpen: boolean
  onClose: () => void
  fileUrl: string
  fileName: string
}

export function PDFViewer({ isOpen, onClose, fileUrl, fileName }: PDFViewerProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[95vw] h-[90vh] p-0">
        <DialogTitle className="sr-only">View PDF: {fileName}</DialogTitle>
        <div className="flex items-center justify-between p-2 border-b">
          <h2 className="text-lg font-semibold px-2">{fileName}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 h-[calc(90vh-4rem)] bg-gray-100">
          <iframe
            src={`${fileUrl}#toolbar=1&view=FitH`}
            className="w-full h-full"
            title={`PDF viewer for ${fileName}`}
            style={{
              border: 'none',
              background: 'white',
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
