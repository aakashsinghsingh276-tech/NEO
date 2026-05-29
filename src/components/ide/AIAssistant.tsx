"use client"

import { useState } from "react"
import { Mic, Send, Bot, Sparkles, X, ChevronUp, Cpu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: "Systems online. Holographic interface active. How can I assist your development today, user?" }
  ])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return
    setMessages([...messages, { role: 'user', content: input }])
    setInput("")
    // Simulate thinking
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Processing request via NEOCADE AI Core. Optimization algorithms engaged." 
      }])
    }, 1000)
  }

  return (
    <>
      {/* Floating Hologram Orb */}
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
          <div className="absolute inset-2 rounded-full border border-primary/30 animate-reverse-spin-slow" />
          <div className="absolute inset-0 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <Cpu className="h-8 w-8" />
          </div>
          <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-black">
            AI
          </div>
        </div>
      </div>

      {/* Assistant Window */}
      <Card className={cn(
        "fixed bottom-8 right-8 z-50 w-[400px] h-[600px] glass-panel border-primary/20 flex flex-col transition-all duration-500 origin-bottom-right",
        isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-50 opacity-0 translate-y-20 pointer-events-none"
      )}>
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-primary/5">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <h3 className="font-headline text-primary font-bold tracking-wider">NEOCADE CORE</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="hover:text-primary">
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
                "p-3 rounded-2xl text-sm",
                msg.role === 'user' 
                  ? "bg-primary text-black font-medium" 
                  : "bg-white/5 border border-white/10 text-foreground"
              )}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="relative">
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm pr-12 focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="Command the AI Assistant..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <div className="absolute right-2 top-1.5 flex gap-1">
              <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-primary">
                <Mic className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={handleSend} className="h-8 w-8 text-primary">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex justify-around mt-3">
             <Button variant="ghost" size="sm" className="text-[10px] text-muted-foreground hover:text-primary gap-1">
               <Sparkles className="h-3 w-3" /> GENERATE PROJECT
             </Button>
             <Button variant="ghost" size="sm" className="text-[10px] text-muted-foreground hover:text-primary gap-1">
               <Bot className="h-3 w-3" /> ANALYZE CODE
             </Button>
          </div>
        </div>
      </Card>
    </>
  )
}
