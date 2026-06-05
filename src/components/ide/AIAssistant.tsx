
"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, X, Cpu, Loader2, Shield, Info, Zap, Wand2, RefreshCw } from "lucide-react"
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
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: "Quantum Intelligence online. I am optimized for multi-language orchestration and neural code generation. Command me, Architect." }
  ])
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  const handleSend = async (overridePrompt?: string) => {
    const prompt = overridePrompt || input
    if (!prompt.trim()) return
    
    setError(null)
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
    } catch (err: any) {
      const errorMessage = "Neural link synchronization failed. Please check your network connection or API configuration."
      setError(errorMessage)
      setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }])
    } finally {
      setLoading(false)
    }
  }

  const content = (
    <>
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
        <div className="flex items-center gap-3">
          <div className="relative">
             <div className="absolute inset-0 bg-primary/20 blur-md rounded-full animate-pulse" />
             <Bot className="h-5 w-5 text-primary relative z-10" />
          </div>
          <div>
            <h3 className="font-headline text-primary font-bold tracking-widest text-[10px] uppercase">NEO CODE AI AGENT</h3>
            <p className="text-[8px] text-muted-foreground tracking-tighter uppercase font-bold">Quantum Core V5.5</p>
          </div>
        </div>
        {!isEmbedded && (
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="hover:text-primary h-8 w-8 rounded-full">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar bg-black/20">
        {messages.map((msg, i) => (
          <div key={i} className={cn(
            "flex gap-3 max-w-[92%]",
            msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
          )}>
            <div className={cn(
              "p-4 rounded-2xl text-[12px] leading-relaxed font-medium shadow-sm transition-all",
              msg.role === 'user' 
                ? "bg-primary text-black font-bold shadow-[0_0_20px_rgba(0,191,255,0.25)] border-none" 
                : "bg-white/5 border border-white/10 text-foreground/90 backdrop-blur-sm"
            )}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-3 text-primary/60 text-[10px] font-bold tracking-widest bg-primary/5 p-3 rounded-lg animate-pulse border border-primary/10">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> SYNCHRONIZING NEURAL-LINK...
          </div>
        )}
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-[10px] font-bold flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-3.5 w-3.5" /> {error}
            </div>
            <Button size="sm" variant="outline" className="h-7 text-[8px] border-destructive/30 hover:bg-destructive/10" onClick={() => handleSend()}>
              RETRY SYNC
            </Button>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/10 bg-black/60">
        <div className="flex gap-2 mb-4 flex-wrap justify-center">
           <Button 
             variant="outline" 
             size="sm" 
             disabled={loading}
             onClick={() => handleSend("Analyze current code for security vulnerabilities and logic flaws.")}
             className="text-[9px] h-7 border-primary/20 text-muted-foreground hover:text-primary gap-1.5 uppercase font-bold bg-black/40"
           >
             <Shield className="h-3 w-3 text-primary" /> AUDIT CODE
           </Button>
           <Button 
             variant="outline" 
             size="sm" 
             disabled={loading}
             onClick={() => handleSend("Refactor the active file for better performance and readability.")}
             className="text-[9px] h-7 border-accent/20 text-muted-foreground hover:text-accent gap-1.5 uppercase font-bold bg-black/40"
           >
             <Zap className="h-3 w-3 text-accent" /> REFACTOR
           </Button>
           <Button 
             variant="outline" 
             size="sm" 
             disabled={loading}
             onClick={() => handleSend("Explain exactly what this code does in architectural terms.")}
             className="text-[9px] h-7 border-white/10 text-muted-foreground hover:text-white gap-1.5 uppercase font-bold bg-black/40"
           >
             <Info className="h-3 w-3" /> EXPLAIN
           </Button>
        </div>
        <div className="relative group">
          <textarea 
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-[13px] pr-14 focus:outline-none focus:border-primary/50 transition-all resize-none custom-scrollbar font-code text-foreground group-hover:bg-black/60"
            placeholder="Command the AI Core..."
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
            className="absolute right-3 bottom-3 h-10 w-10 text-primary hover:bg-primary/20 rounded-xl transition-all"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <div className="mt-3 text-center">
           <p className="text-[8px] text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-1.5 opacity-60">
             <Wand2 className="h-2.5 w-2.5" /> AI AGENT READY TO BUILD
           </p>
        </div>
      </div>
    </>
  )

  if (isEmbedded) {
    return (
      <div className="h-full flex flex-col bg-black/40 backdrop-blur-md">
        {content}
      </div>
    )
  }

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-12 right-12 z-50 transition-all duration-700 cursor-pointer group",
          isOpen ? "scale-0 rotate-180" : "scale-100 rotate-0"
        )}
      >
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full bg-primary/25 blur-2xl animate-glow-pulse" />
          <div className="absolute inset-0 rounded-full border-2 border-primary/40 animate-spin-slow" />
          <div className="absolute inset-0 flex items-center justify-center text-primary group-hover:scale-125 transition-transform">
            <Cpu className="h-8 w-8 drop-shadow-[0_0_10px_rgba(0,191,255,0.6)]" />
          </div>
        </div>
      </div>

      <Card className={cn(
        "fixed bottom-12 right-12 z-50 w-[420px] h-[680px] glass-panel border-primary/25 flex flex-col transition-all duration-700 origin-bottom-right shadow-[0_0_80px_rgba(0,191,255,0.15)] overflow-hidden",
        isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-50 opacity-0 translate-y-40 pointer-events-none"
      )}>
        {content}
      </Card>
    </>
  )
}
