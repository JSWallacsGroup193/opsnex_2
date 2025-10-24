

import { useState } from "react"
import { Pin, Paperclip, Send, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { AccountNote } from "@/types/view-models/account-detail"

interface NotesTabProps {
  notes: AccountNote[]
  onAddNote: (content: string, attachments?: File[]) => void
  onTogglePin: (noteId: string) => void
}

export function NotesTab({ notes, onAddNote, onTogglePin }: NotesTabProps) {
  const [newNote, setNewNote] = useState("")

  const handleSubmit = () => {
    if (newNote.trim()) {
      onAddNote(newNote)
      setNewNote("")
    }
  }

  return (
    <div className="space-y-6">
      {/* Add Note Form */}
      <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Add Note</h3>
        <Textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write a note..."
          className="bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500 mb-3 min-h-[100px]"
        />
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-400 hover:bg-slate-600 bg-transparent"
          >
            <Paperclip className="h-4 w-4 mr-2" />
            Attach File
          </Button>
          <Button onClick={handleSubmit} className="bg-teal-500 text-white hover:bg-teal-600">
            <Send className="h-4 w-4 mr-2" />
            Post Note
          </Button>
        </div>
      </div>

      {/* Notes Feed */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-100">Notes</h3>
        {notes.map((note) => (
          <div key={note.id} className="bg-slate-700 rounded-lg p-6 border border-slate-600">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 font-semibold">
                  {note.author.charAt(0)}
                </div>
                <div>
                  <p className="text-slate-100 font-medium">{note.author}</p>
                  <p className="text-sm text-slate-400">{note.timestamp}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTogglePin(note.id)}
                className={note.isPinned ? "text-teal-500 hover:text-teal-400" : "text-slate-400 hover:text-slate-300"}
              >
                <Pin className={`h-4 w-4 ${note.isPinned ? "fill-teal-500" : ""}`} />
              </Button>
            </div>

            <p className="text-slate-100 mb-3">{note.content}</p>

            {note.attachments && note.attachments.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {note.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 bg-slate-800 rounded border border-slate-600 text-sm text-slate-300"
                  >
                    {attachment}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Files Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-100">Files</h3>
          <Button variant="outline" className="border-teal-500 text-teal-500 hover:bg-teal-500/10 bg-transparent">
            <Upload className="h-4 w-4 mr-2" />
            Upload File
          </Button>
        </div>

        <div className="bg-slate-700 rounded-lg p-12 border border-slate-600 text-center">
          <p className="text-slate-400">No files uploaded yet</p>
        </div>
      </div>
    </div>
  )
}
