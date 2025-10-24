import { useState } from "react"
import { Upload, FileText, Download, Trash2, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Photo {
  id: string
  url: string
  name: string
}

interface Document {
  id: string
  name: string
  type: string
  size: string
  uploadedDate: string
}

interface PhotosDocumentsTabProps {
  photos: Photo[]
  documents: Document[]
  onUploadPhoto: () => void
  onUploadDocument: () => void
  onDeletePhoto: (id: string) => void
  onDeleteDocument: (id: string) => void
}

export function PhotosDocumentsTab({
  photos,
  documents,
  onUploadPhoto,
  onUploadDocument,
  onDeletePhoto,
  onDeleteDocument,
}: PhotosDocumentsTabProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  return (
    <div className="space-y-6">
      {/* Photos Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-100">Photos</h3>
          <Button onClick={onUploadPhoto} className="bg-teal-500 hover:bg-teal-600 text-white">
            <Upload className="h-4 w-4 mr-2" />
            Upload Photo
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative group bg-slate-700 rounded-lg overflow-hidden cursor-pointer"
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="aspect-square bg-slate-800 flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-slate-600" />
              </div>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeletePhoto(photo.id)
                  }}
                  className="text-white hover:bg-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="p-2 text-xs text-slate-400 truncate">{photo.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Documents Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-100">Documents</h3>
          <Button onClick={onUploadDocument} className="bg-teal-500 hover:bg-teal-600 text-white">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>

        <div className="bg-slate-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-600">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-600/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-teal-500" />
                        <span className="text-slate-100">{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-400">{doc.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-400">{doc.size}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-400">{doc.uploadedDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" className="text-teal-500 hover:bg-teal-500/10">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteDocument(doc.id)}
                          className="text-red-500 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-4xl w-full bg-slate-800 rounded-lg p-4">
            <div className="aspect-video bg-slate-900 rounded flex items-center justify-center">
              <ImageIcon className="h-24 w-24 text-slate-600" />
            </div>
            <p className="text-slate-100 mt-4">{selectedPhoto.name}</p>
          </div>
        </div>
      )}
    </div>
  )
}
