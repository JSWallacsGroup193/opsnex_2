

import type { ChangeEvent } from "react"

import { useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { ChevronDown, ChevronUp, Upload, X, FileText } from "lucide-react"
import type { WorkOrderFormData } from "@/lib/validations/work-order-form"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

interface AdditionalSectionProps {
  form: UseFormReturn<WorkOrderFormData>
}

const commonTags = ["Warranty", "Follow-up", "VIP Customer", "Recurring Issue", "New Installation"]

export function AdditionalSection({ form }: AdditionalSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [tagInput, setTagInput] = useState("")

  const tags = form.watch("tags") || []
  const attachments = form.watch("attachments") || []

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      form.setValue("tags", [...tags, tag])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    form.setValue(
      "tags",
      tags.filter((t) => t !== tagToRemove),
    )
  }

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newAttachments = Array.from(files).map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
      }))
      form.setValue("attachments", [...attachments, ...newAttachments])
    }
  }

  const removeAttachment = (index: number) => {
    form.setValue(
      "attachments",
      attachments.filter((_, i) => i !== index),
    )
  }

  return (
    <div className="bg-slate-700 rounded-lg border border-slate-600">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-600/50 transition-colors rounded-t-lg"
      >
        <h2 className="text-lg font-semibold text-slate-100">
          Additional Information <span className="text-slate-400 text-sm font-normal">(Optional)</span>
        </h2>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-slate-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-400" />
        )}
      </button>

      {isExpanded && (
        <div className="p-4 space-y-4 border-t border-slate-600">
          {/* Internal Notes */}
          <div className="space-y-2">
            <Label htmlFor="internalNotes" className="text-slate-100">
              Internal Notes
              <span className="text-slate-400 text-sm font-normal ml-2">(For technician eyes only)</span>
            </Label>
            <Textarea
              id="internalNotes"
              {...form.register("internalNotes")}
              placeholder="Add internal notes for the technician..."
              className="min-h-[100px] bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 resize-none"
            />
          </div>

          {/* File Attachments */}
          <div className="space-y-2">
            <Label className="text-slate-100">Attach Files</Label>
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-slate-500 transition-colors">
              <input
                type="file"
                id="fileUpload"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-slate-400" />
                <div className="text-sm text-slate-300">
                  <span className="text-teal-500 hover:text-teal-400">Click to upload</span> or drag and drop
                </div>
                <div className="text-xs text-slate-400">Photos, PDFs, or documents</div>
              </label>
            </div>

            {attachments.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                {attachments.map((attachment, index) => (
                  <div key={index} className="relative group bg-slate-800 rounded-lg border border-slate-600 p-2">
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    {attachment.type.startsWith("image/") ? (
                      <img
                        src={attachment.url || "/placeholder.svg"}
                        alt={attachment.name}
                        className="w-full h-20 object-cover rounded"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-20">
                        <FileText className="h-8 w-8 text-slate-400" />
                      </div>
                    )}
                    <p className="text-xs text-slate-400 mt-1 truncate">{attachment.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-slate-100">Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-teal-500/20 text-teal-500 rounded-full text-sm"
                >
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-teal-400">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTag(tagInput)
                  }
                }}
                placeholder="Type and press Enter to add tag..."
                className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {commonTags
                .filter((t) => !tags.includes(t))
                .map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addTag(tag)}
                    className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm border border-slate-600 hover:border-teal-500 hover:text-teal-500 transition-colors"
                  >
                    + {tag}
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
