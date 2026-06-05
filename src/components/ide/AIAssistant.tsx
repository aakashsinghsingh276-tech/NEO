
"use client"

import { useState } from "react"
import { Mic, Send, Bot, Sparkles, X, Cpu, Loader2, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ideAgent } from "@/ai/flows/ide-agent-flow"

interface AIAssistantProps {
  currentFile?: string
  currentCode?: string
  fileList: string[]
  onAction: (action: any) => void
  isEmbedded?: boolean
}

export function AIAssistant({ currentFile, currentCode, fileList, onAction, isEmbedded }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: "Quantum Intelligence online. I can generate projects, refactor code, and analyze neural pathways. How can I assist your mission, architect?" }
  ])
  const [input, setInput] = useState("")

  const handleSend = async (overridePrompt?: string) => {
    const prompt = overridePrompt || input
    if (!prompt.trim()) return
    
    setMessages(prev => [...prev, { role: 'user', content: prompt }])
    if (!overridePrompt) setInput("")
    setLoading(true)

    try {
      const result = await ideAgent({
        prompt,
        context: { currentFile, currentCode, fileList }
      })

      setMessages(prev => [...prev, { role: 'assistant', content: result.response }])
      
      if (result.actions) {
        result.actions.forEach(action => {
          onAction(action)
        })
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Critical link failure. AI Core unreachable." }])
    } finally {
      setLoading(false)
    }
  }

  const content = (
    <>
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-primary/5">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-primary" />
          <h3 className="font-headline text-primary font-bold tracking-wider text-xs uppercase">NEO CODE AI CORE</h3>
        </div>
        {!isEmbedded && (
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="hover:text-primary h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={cn(
            "flex gap-2 max-w-[90%]",
            msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
          )}>
            <div className={cn(
              "p-3 rounded-xl text-sm leading-relaxed",
              msg.role === 'user' 
                ? "bg-primary text-black font-semibold shadow-[0_0_15px_rgba(0,191,255,0.3)]" 
                : "bg-white/5 border border-white/10 text-foreground"
            )}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-primary/50 text-xs italic">
            <Loader2 className="h-3 w-3 animate-spin" /> SYNCHRONIZING NEURAL-LINK...
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/10 bg-black/40">
        <div className="relative">
          <textarea 
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm pr-12 focus:outline-none focus:border-primary/50 transition-colors resize-none custom-scrollbar"
            placeholder="Command the AI Assistant..."
            rows={2}
            value={input}
            disabled={loading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => handleSend()} 
            disabled={loading}
            className="absolute right-2 bottom-2 h-8 w-8 text-primary hover:bg-primary/20"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3 justify-center">
           <Button 
             variant="outline" 
             size="sm" 
             disabled={loading}
             onClick={() => handleSend("Generate a professional landing page component with Tailwind")}
             className="text-[9px] h-7 border-primary/20 text-muted-foreground hover:text-primary gap-1 uppercase tracking-tighter"
           >
             <Sparkles className="h-3 w-3" /> GENERATE UI
           </Button>
           <Button 
             variant="outline" 
             size="sm" 
             disabled={loading}
             onClick={() => handleSend("Review this code for performance bottlenecks and security flaws")}
             className="text-[9px] h-7 border-primary/20 text-muted-foreground hover:text-primary gap-1 uppercase tracking-tighter"
           >
             <Bot className="h-3 w-3" /> CODE REVIEW
           </Button>
        </div>
      </div>
    </>
  )

  if (isEmbedded) {
    return (
      <div className="h-full flex flex-col bg-black/40 backdrop-blur-sm">
        {content}
      </div>
    )
  }

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-10 right-10 z-50 transition-all duration-500 cursor-pointer group",
          isOpen ? "scale-0 rotate-180" : "scale-100 rotate-0"
        )}
      >
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-glow-pulse" />
          <div className="absolute inset-0 rounded-full border-2 border-primary/50 animate-spin-slow" />
          <div className="absolute inset-0 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <Cpu className="h-7 w-7" />
          </div>
        </div>
      </div>

      <Card className={cn(
        "fixed bottom-10 right-10 z-50 w-[400px] h-[600px] glass-panel border-primary/20 flex flex-col transition-all duration-500 origin-bottom-right shadow-[0_0_50px_rgba(0,191,255,0.1)]",
        isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-50 opacity-0 translate-y-20 pointer-events-none"
      )}>
        {content}
      </Card>
    </>
  )
}
