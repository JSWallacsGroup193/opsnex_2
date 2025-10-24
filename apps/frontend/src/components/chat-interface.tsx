import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Bot, Trash2, Send, Copy, ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import ReactMarkdown from "react-markdown"

export interface Message {
  id: string
  type: "user" | "ai" | "system"
  content: string
  timestamp: Date
  feedback?: "up" | "down"
}

interface ChatInterfaceProps {
  messages: Message[]
  onSendMessage: (text: string) => void
  onClearHistory: () => void
  isLoading: boolean
}

const quickSuggestions = [
  "Help with superheat calculation",
  "How to diagnose no heat call",
  "Refrigerant charging procedure",
  "Troubleshoot low airflow",
]

export function ChatInterface({ messages, onSendMessage, onClearHistory, isLoading }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleSend = () => {
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim())
      setInputValue("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
    // Auto-expand textarea
    e.target.style.height = "auto"
    const newHeight = Math.min(e.target.scrollHeight, 96) // Max 4 lines (~24px per line)
    e.target.style.height = `${newHeight}px`
  }

  const handleSuggestionClick = (suggestion: string) => {
    onSendMessage(suggestion)
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const hasUserMessages = messages.some((m) => m.type === "user")

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-700 bg-[#1e293b] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500/20">
            <Bot className="h-5 w-5 text-teal-500" />
          </div>
          <h1 className="text-lg font-semibold text-slate-100">HVAC Assistant</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClearHistory}
          className="text-slate-400 hover:bg-slate-700 hover:text-red-500"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-[#1e293b] px-4 py-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} onCopy={handleCopyMessage} />
          ))}

          {isLoading && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 border-t border-slate-700 bg-[#1e293b] px-4 py-4">
        <div className="mx-auto max-w-3xl">
          {/* Quick Suggestions */}
          {!hasUserMessages && (
            <div className="mb-3 flex flex-wrap gap-2">
              {quickSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="rounded-full bg-[#334155] px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-[#475569]"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex items-end gap-2">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about HVAC..."
              className="min-h-[44px] max-h-24 resize-none bg-[#334155] border-0 text-slate-100 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-teal-500"
              rows={1}
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className={`h-11 w-11 shrink-0 ${inputValue.trim() ? "bg-teal-500 hover:bg-teal-600" : "bg-slate-600"}`}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function MessageBubble({
  message,
  onCopy,
}: {
  message: Message
  onCopy: (content: string) => void
}) {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null)

  if (message.type === "system") {
    return (
      <div className="flex justify-center">
        <p className="text-sm italic text-slate-400">{message.content}</p>
      </div>
    )
  }

  if (message.type === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl bg-[#475569] px-4 py-3">
          <p className="text-slate-100">{message.content}</p>
        </div>
      </div>
    )
  }

  // AI message
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-500/20">
        <Bot className="h-4 w-4 text-teal-500" />
      </div>
      <div className="flex-1">
        <div className="max-w-[90%] rounded-2xl bg-[#334155] px-4 py-3">
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown
              components={{
                code: ({ inline, className, children, ...props }: any) => {
                  if (inline) {
                    return (
                      <code className="rounded bg-[#1e293b] px-1.5 py-0.5 text-teal-400" {...props}>
                        {children}
                      </code>
                    )
                  }
                  return (
                    <code className="block rounded-lg bg-[#1e293b] p-3 text-sm text-slate-100" {...props}>
                      {children}
                    </code>
                  )
                },
                p: ({ children }: { children?: React.ReactNode }) => <p className="mb-2 last:mb-0 text-slate-100">{children}</p>,
                ul: ({ children }: { children?: React.ReactNode }) => <ul className="mb-2 ml-4 list-disc text-slate-100">{children}</ul>,
                li: ({ children }: { children?: React.ReactNode }) => <li className="mb-1 text-slate-100">{children}</li>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
        {/* Actions */}
        <div className="mt-2 flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCopy(message.content)}
            className="h-7 text-slate-400 hover:bg-slate-700 hover:text-slate-300"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFeedback(feedback === "up" ? null : "up")}
            className={`h-7 ${
              feedback === "up" ? "text-teal-500" : "text-slate-400 hover:bg-slate-700 hover:text-slate-300"
            }`}
          >
            <ThumbsUp className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFeedback(feedback === "down" ? null : "down")}
            className={`h-7 ${
              feedback === "down" ? "text-red-500" : "text-slate-400 hover:bg-slate-700 hover:text-slate-300"
            }`}
          >
            <ThumbsDown className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-500/20">
        <Bot className="h-4 w-4 text-teal-500" />
      </div>
      <div className="flex items-center gap-2 rounded-2xl bg-[#334155] px-4 py-3">
        <div className="flex gap-1">
          <div className="h-2 w-2 animate-bounce rounded-full bg-teal-500 [animation-delay:-0.3s]" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-teal-500 [animation-delay:-0.15s]" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-teal-500" />
        </div>
        <span className="text-sm text-slate-400">AI is thinking...</span>
      </div>
    </div>
  )
}
