"use client"

import { useState, useEffect } from "react"
import { Terminal, Shield, Cpu, RefreshCw, X, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

const tabs = [
  { id: 'terminal', label: 'Terminal', icon: Terminal },
  { id: 'output', label: 'Output', icon: Cpu },
  { id: 'debug', label: 'Debug Console', icon: RefreshCw },
  { id: 'security', label: 'Security Lab', icon: Shield }
]

export function TerminalView() {
  const [activeTab, setActiveTab] = useState('terminal')
  const [input, setInput] = useState("")
  const [logs, setLogs] = useState([
    { type: 'info', text: 'NEOCADE Code Engine v1.0.0 initialized...' },
    { type: 'success', text: 'Universal Polyglot Runtime started successfully.' },
    { type: 'warning', text: 'Optimizing memory usage: RAM detected, applying Neural-Cache.' },
    { type: 'info', text: 'listening on port 9002' }
  ])

  const handleCommand = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      const command = input.trim().toLowerCase()
      const newLogs = [...logs, { type: 'info', text: `NEOCADE@Quantum:~$ ${input}` }]
      
      if (command === 'help') {
        newLogs.push({ type: 'info', text: 'Available commands: help, status, scan, run, clear' })
      } else if (command === 'status') {
        newLogs.push({ type: 'success', text: 'SYSTEMS: 100% | QUANTUM: STABLE | NEURAL-LINK: ACTIVE' })
      } else if (command === 'run') {
        newLogs.push({ type: 'info', text: 'Executing main process...' })
        setTimeout(() => {
          setLogs(prev => [...prev, { type: 'success', text: 'Execution complete. Hello World output successful.' }])
        }, 1000)
      } else if (command === 'clear') {
        setLogs([])
        setInput("")
        return
      } else {
        newLogs.push({ type: 'error', text: `Command not found: ${command}` })
      }
      
      setLogs(newLogs)
      setInput("")
    }
  }

  return (
    <div className="h-[240px] border-t border-border bg-black/40 flex flex-col">
      <div className="flex items-center px-4 bg-sidebar/40 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-xs font-medium transition-all border-b-2",
              activeTab === tab.id 
                ? "text-primary border-primary bg-primary/5" 
                : "text-muted-foreground border-transparent hover:text-foreground"
            )}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
           <button className="p-1 hover:bg-white/10 rounded-sm">
             <ChevronUp className="h-4 w-4 text-muted-foreground" />
           </button>
           <button className="p-1 hover:bg-white/10 rounded-sm">
             <X className="h-4 w-4 text-muted-foreground" />
           </button>
        </div>
      </div>

      <div className="flex-1 p-4 font-code text-sm overflow-y-auto custom-scrollbar bg-black/20">
        {logs.map((log, i) => (
          <div key={i} className="mb-1">
            <span className="text-primary/50 mr-2">❯</span>
            <span className={cn(
              log.type === 'success' && "text-primary",
              log.type === 'warning' && "text-yellow-400",
              log.type === 'error' && "text-red-400",
              log.type === 'info' && "text-muted-foreground"
            )}>
              {log.text}
            </span>
          </div>
        ))}
        <div className="flex items-center">
          <span className="text-primary mr-2 whitespace-nowrap">NEOCADE@Quantum:~$</span>
          <input 
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
