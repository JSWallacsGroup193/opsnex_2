import { useState } from "react"
import { ChatInterface } from "@/components/chat-interface"
import type { Message } from "@/components/chat-interface"
import api from "../utils/axiosClient"

export default function AI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "system",
      content: "Chat started - Ask me anything about HVAC, inventory, or work orders!",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (text: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: text,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    // Call backend AI API
    setIsLoading(true)
    try {
      const { data } = await api.post("/chat", { prompt: text })
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: data.response || "I'm sorry, I couldn't process that request.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("AI chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearHistory = () => {
    setMessages([
      {
        id: Date.now().toString(),
        type: "system",
        content: "Chat cleared",
        timestamp: new Date(),
      },
    ])
  }

  return (
    <div className="h-[calc(100vh-56px)] bg-[#0f172a] flex flex-col">
      {/* Page Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-4 flex-shrink-0">
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">AI Assistant</h1>
        <p className="text-slate-400 text-xs sm:text-sm">Call in backup. Get answers. Execute.</p>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          onClearHistory={handleClearHistory}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}