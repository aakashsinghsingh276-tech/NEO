"use client"

import { useState } from "react"
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
  const [logs, setLogs] = useState([
    { type: 'info', text: 'Gangeriya Code Engine v4.2.0 initialized...' },
    { type: 'success', text: 'Universal Polyglot Runtime started successfully.' },
    { type: 'warning', text: 'Optimizing memory usage: RAM 32GB detected, applying Neural-Cache.' },
    { type: 'info', text: 'listening on port 9002' }
  ])

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
          <span className="text-primary mr-2">Gangeriya@Quantum:~$</span>
          <input className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-foreground" autoFocus />
        </div>
      </div>
    </div>
  )
}