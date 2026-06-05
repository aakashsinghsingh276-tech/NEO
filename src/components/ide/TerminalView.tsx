"use client"

import { useState, useRef, useEffect } from "react"
import { Terminal as TerminalIcon, Shield, Cpu, RefreshCw, X, Plus, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TerminalInstance {
  id: string
  name: string
  logs: { type: 'info' | 'success' | 'warning' | 'error', text: string }[]
}

export function TerminalView() {
  const [terminals, setTerminals] = useState<TerminalInstance[]>([
    { 
      id: 'term-1', 
      name: 'node', 
      logs: [{ type: 'info', text: 'NEO CODE Code Engine initialized on port 9002' }] 
    }
  ])
  const [activeId, setActiveId] = useState('term-1')
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const activeTerm = terminals.find(t => t.id === activeId) || terminals[0]

  const addTerminal = () => {
    const newId = `term-${Date.now()}`
    setTerminals([...terminals, { 
      id: newId, 
      name: `term ${terminals.length + 1}`, 
      logs: [{ type: 'info', text: 'New shell session started...' }] 
    }])
    setActiveId(newId)
  }

  const handleCommand = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      const command = input.trim().toLowerCase()
      const newLogs = [...activeTerm.logs, { type: 'info', text: `NEOCODE@Quantum:~$ ${input}` }] as any
      
      if (command === 'help') {
        newLogs.push({ type: 'info', text: 'Commands: help, status, clear, run, neofetch' })
      } else if (command === 'clear') {
        updateActiveLogs([])
        setInput("")
        return
      } else if (command === 'status') {
        newLogs.push({ type: 'success', text: 'SYSTEM: OPTIMIZED | CPU: 14% | LATENCY: 2ms' })
      } else {
        newLogs.push({ type: 'error', text: `Command not found: ${command}` })
      }
      
      updateActiveLogs(newLogs)
      setInput("")
    }
  }

  const updateActiveLogs = (newLogs: any) => {
    setTerminals(prev => prev.map(t => t.id === activeId ? { ...t, logs: newLogs } : t))
  }

  return (
    <div className="h-[240px] border-t border-border bg-black/40 flex flex-col">
      <div className="flex items-center px-4 bg-sidebar/40 border-b border-border h-9">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1">
          {terminals.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveId(t.id)}
              className={cn(
                "flex items-center gap-2 px-3 h-9 text-[10px] font-bold uppercase tracking-wider transition-all border-b-2",
                activeId === t.id 
                  ? "text-primary border-primary bg-primary/5" 
                  : "text-muted-foreground border-transparent hover:text-foreground"
              )}
            >
              <TerminalIcon className="h-3 w-3" />
              {t.name}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 pl-4 border-l border-border/50 ml-2">
           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 hover:bg-white/10 rounded-sm text-muted-foreground hover:text-primary transition-colors">
                  <Plus className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-panel border-primary/20 text-[10px]">
                <DropdownMenuItem onClick={addTerminal} className="uppercase font-bold">New Terminal</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveId(terminals[0].id)} className="uppercase font-bold">Old Terminal (node)</DropdownMenuItem>
              </DropdownMenuContent>
           </DropdownMenu>
           <button className="p-1 hover:bg-white/10 rounded-sm">
             <X className="h-4 w-4 text-muted-foreground" />
           </button>
        </div>
      </div>

      <div 
        className="flex-1 p-4 font-code text-xs overflow-y-auto custom-scrollbar bg-black/20"
        onClick={() => inputRef.current?.focus()}
      >
        {activeTerm.logs.map((log, i) => (
          <div key={i} className="mb-1">
            <span className="text-primary/50 mr-2 opacity-50">❯</span>
            <span className={cn(
              log.type === 'success' && "text-primary",
              log.type === 'warning' && "text-yellow-400",
              log.type === 'error' && "text-red-400",
              log.type === 'info' && "text-muted-foreground/80"
            )}>
              {log.text}
            </span>
          </div>
        ))}
        <div className="flex items-center">
          <span className="text-primary mr-2 whitespace-nowrap">NEO CODE@Quantum:~$</span>
          <input 
            ref={inputRef}
            className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-foreground" 
            autoFocus 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
          />
        </div>
      </div>
    </div>
  )
}
