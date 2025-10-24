import { useState } from "react"
import { Paperclip, Send, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Note } from "@/types/view-models/work-order"

interface NotesTabProps {
  notes: Note[]
  onAddNote: (text: string, photos?: File[]) => void
}

export function NotesTab({ notes, onAddNote }: NotesTabProps) {
  const [newNote, setNewNote] = useState("")

  const handleSubmit = () => {
    if (newNote.trim()) {
      onAddNote(newNote.trim())
      setNewNote("")
    }
  }

  return (
    <div className="space-y-6">
      {/* Add Note Form */}
      <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
        <h2 className="text-lg font-bold text-slate-100 mb-4">Add Note</h2>
        <Textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write a note..."
          className="bg-slate-800 border-slate-600 text-slate-100 min-h-[100px] mb-3"
        />
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
            >
              <Paperclip className="w-4 h-4 mr-2" />
              Attach Files
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Upload Photos
            </Button>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!newNote.trim()}
            className="bg-teal-500 hover:bg-teal-600 text-white"
          >
            <Send className="w-4 h-4 mr-2" />
            Post Note
          </Button>
        </div>
      </div>

      {/* Notes Feed */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-100">Notes & Photos</h2>
        {notes.length === 0 ? (
          <div className="bg-slate-700 rounded-lg p-8 border border-slate-600 text-center">
            <p className="text-slate-400">No notes yet</p>
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={note.author.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-teal-500/20 text-teal-500">
                    {note.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-slate-100 font-medium">{note.author.name}</span>
                    <span className="text-slate-400 text-sm">{new Date(note.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-100 mb-3">{note.text}</p>

                  {/* Photo Thumbnails */}
                  {note.photos && note.photos.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {note.photos.map((photo, idx) => (
                        <div
                          key={idx}
                          className="aspect-square rounded-lg bg-slate-800 border border-slate-600 overflow-hidden cursor-pointer hover:border-teal-500 transition-colors"
                        >
                          <img
                            src={photo || "/placeholder.svg"}
                            alt={`Photo ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
