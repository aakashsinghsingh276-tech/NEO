"use client"

import { useState } from "react"
import { Mic, Send, Bot, Sparkles, X, Cpu, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ideAgent } from "@/ai/flows/ide-agent-flow"

interface AIAssistantProps {
  currentFile?: string
  currentCode?: string
  fileList: string[]
  onAction: (action: any) => void
}

export function AIAssistant({ currentFile, currentCode, fileList, onAction }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: "Systems online. How can I assist your development today, user?" }
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
      setMessages(prev => [...prev, { role: 'assistant', content: "Error communicating with AI Core. Check connection." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-8 right-8 z-50 transition-all duration-500 cursor-pointer group",
          isOpen ? "scale-0 rotate-180" : "scale-100 rotate-0"
        )}
      >
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-glow-pulse" />
          <div className="absolute inset-0 rounded-full border-2 border-primary/50 animate-spin-slow" />
          <div className="absolute inset-0 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <Cpu className="h-8 w-8" />
          </div>
        </div>
      </div>

      <Card className={cn(
        "fixed bottom-8 right-8 z-50 w-[400px] h-[600px] glass-panel border-primary/20 flex flex-col transition-all duration-500 origin-bottom-right",
        isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-50 opacity-0 translate-y-20 pointer-events-none"
      )}>
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-primary/5">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-primary" />
            <h3 className="font-headline text-primary font-bold tracking-wider text-xs uppercase">NEO CODE AI CORE</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="hover:text-primary h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={cn(
              "flex gap-2 max-w-[85%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}>
              <div className={cn(
                "p-3 rounded-2xl text-sm leading-relaxed",
                msg.role === 'user' 
                  ? "bg-primary text-black font-medium" 
                  : "bg-white/5 border border-white/10 text-foreground"
              )}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-primary/50 text-xs italic">
              <Loader2 className="h-3 w-3 animate-spin" /> Thinking...
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="relative">
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm pr-12 focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="Command the AI Assistant..."
              value={input}
              disabled={loading}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => handleSend()} 
              disabled={loading}
              className="absolute right-2 top-1.5 h-8 w-8 text-primary"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex justify-around mt-3">
             <Button 
               variant="ghost" 
               size="sm" 
               disabled={loading}
               onClick={() => handleSend("Generate a full-stack project structure for a task app")}
               className="text-[10px] text-muted-foreground hover:text-primary gap-1"
             >
               <Sparkles className="h-3 w-3" /> GENERATE PROJECT
             </Button>
             <Button 
               variant="ghost" 
               size="sm" 
               disabled={loading}
               onClick={() => handleSend("Analyze this code for bugs and optimization")}
               className="text-[10px] text-muted-foreground hover:text-primary gap-1"
             >
               <Bot className="h-3 w-3" /> ANALYZE CODE
             </Button>
          </div>
        </div>
      </Card>
    </>
  )
}
