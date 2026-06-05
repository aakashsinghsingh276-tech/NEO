
"use client"

import { useState, useRef, useEffect } from "react"
import { Terminal as TerminalIcon, Shield, Cpu, RefreshCw, X, Plus, ChevronDown, Play, Square, Trash2 } from "lucide-react"
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
  logs: { type: 'info' | 'success' | 'warning' | 'error' | 'input', text: string }[]
}

const LANGUAGE_RUN_COMMANDS: Record<string, string> = {
  js: 'node',
  ts: 'tsx',
  py: 'python3',
  java: 'javac %f && java %n',
  cpp: 'g++ %f -o %n && ./%n',
  c: 'gcc %f -o %n && ./%n',
  go: 'go run %f',
  rs: 'rustc %f && ./%n',
  php: 'php %f',
  rb: 'ruby %f',
  lua: 'lua %f',
  cs: 'dotnet run',
}

export function TerminalView({ activeFile }: { activeFile?: string }) {
  const [terminals, setTerminals] = useState<TerminalInstance[]>([
    { 
      id: 'term-node', 
      name: 'node', 
      logs: [{ type: 'info', text: 'NEO CODE Code Engine v1.0.4 initialized on port 9002' }] 
    }
  ])
  const [activeId, setActiveId] = useState('term-node')
  const [input, setInput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const activeTerm = terminals.find(t => t.id === activeId) || terminals[0]

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [activeTerm.logs])

  const addTerminal = (name?: string) => {
    const newId = `term-${Date.now()}`
    setTerminals([...terminals, { 
      id: newId, 
      name: name || `bash ${terminals.length}`, 
      logs: [{ type: 'info', text: `Quantum Shell session established [${newId}]` }] 
    }])
    setActiveId(newId)
  }

  const killTerminal = (id: string) => {
    if (terminals.length === 1) return
    const newTerms = terminals.filter(t => t.id !== id)
    setTerminals(newTerms)
    if (activeId === id) setActiveId(newTerms[0].id)
  }

  const handleCommand = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      const cmd = input.trim().toLowerCase()
      const newLogs = [...activeTerm.logs, { type: 'input', text: input }]
      
      if (cmd === 'help') {
        newLogs.push({ type: 'info', text: 'Commands: help, status, clear, run, neofetch, system-scan, npm, pip' })
      } else if (cmd === 'clear') {
        updateActiveLogs([])
        setInput("")
        return
      } else if (cmd === 'status') {
        newLogs.push({ type: 'success', text: 'SYSTEM: OPTIMIZED | CPU: 14% | LATENCY: 2ms | UPTIME: 14h 23m' })
      } else if (cmd === 'run') {
        setIsRunning(true)
        const ext = activeFile?.split('.').pop() || 'js'
        const baseName = activeFile?.split('.')[0] || 'app'
        const runCmdTemplate = LANGUAGE_RUN_COMMANDS[ext] || 'node'
        const runCmd = runCmdTemplate.replace('%f', activeFile || 'app.js').replace('%n', baseName)
        
        newLogs.push({ type: 'info', text: `Executing: ${runCmd}` })
        setTimeout(() => {
           newLogs.push({ type: 'success', text: `[${activeFile}] Process exited with status 0.` })
           setIsRunning(false)
           updateActiveLogs([...newLogs])
        }, 1200)
      } else if (cmd === 'neofetch') {
        newLogs.push({ type: 'info', text: 'OS: NEO CODE Quantum v1\nKernel: 5.15.0-generic\nUptime: 14 hours\nPackages: 1337 (apt)\nShell: zsh 5.8\nCPU: AMD EPYC (Quantum)\nGPU: Simulated-X 4090\nMemory: 32GiB' })
      } else if (cmd.startsWith('npm') || cmd.startsWith('pip')) {
        newLogs.push({ type: 'info', text: `Synchronizing packages for project...` })
        setTimeout(() => {
           newLogs.push({ type: 'success', text: `Dependencies updated successfully.` })
           updateActiveLogs([...newLogs, { type: 'info', text: 'All vulnerability checks passed.' }])
        }, 1500)
      } else {
        newLogs.push({ type: 'error', text: `QuantumShell: Command not found: ${cmd}` })
      }
      
      updateActiveLogs(newLogs)
      setInput("")
    }
  }

  const updateActiveLogs = (newLogs: any) => {
    setTerminals(prev => prev.map(t => t.id === activeId ? { ...t, logs: newLogs } : t))
  }

  return (
    <div className="h-[280px] border-t border-border bg-[#0a0d12] flex flex-col font-code">
      <div className="flex items-center px-4 bg-sidebar/20 border-b border-border h-9 justify-between">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1">
          {terminals.map((t) => (
            <div
              key={t.id}
              onClick={() => setActiveId(t.id)}
              className={cn(
                "flex items-center gap-2 px-3 h-9 text-[10px] font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer group",
                activeId === t.id 
                  ? "text-primary border-primary bg-primary/5" 
                  : "text-muted-foreground border-transparent hover:text-foreground hover:bg-white/5"
              )}
            >
              <TerminalIcon className="h-3 w-3" />
              {t.name}
              <button 
                onClick={(e) => { e.stopPropagation(); killTerminal(t.id); }}
                className="ml-2 opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-3 pl-4 border-l border-border/50 ml-2">
           <button 
             onClick={() => {
                setInput('run')
                // Force a pseudo-enter
                const event = { key: 'Enter', preventDefault: () => {}, target: { value: 'run' } } as any
                handleCommand(event)
             }} 
             className={cn("p-1 rounded hover:bg-white/10 transition-colors", isRunning ? "text-red-400" : "text-primary")}
           >
             {isRunning ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
           </button>
           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 hover:bg-white/10 rounded-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  <ChevronDown className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-panel border-primary/20 text-[10px] min-w-[150px]">
                <DropdownMenuItem onClick={() => addTerminal()} className="uppercase font-bold gap-2">
                  <TerminalIcon className="h-3 w-3" /> New bash Session
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addTerminal('node')} className="uppercase font-bold gap-2">
                  <Cpu className="h-3 w-3" /> New node Environment
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveId('term-node')} className="uppercase font-bold gap-2">
                  <RefreshCw className="h-3 w-3" /> Connect to Active 'node'
                </DropdownMenuItem>
              </DropdownMenuContent>
           </DropdownMenu>
           <button onClick={() => updateActiveLogs([])} className="p-1 hover:bg-white/10 rounded-sm" title="Clear All">
             <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-400" />
           </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 p-4 text-xs overflow-y-auto custom-scrollbar bg-black/30"
        onClick={() => inputRef.current?.focus()}
      >
        {activeTerm.logs.map((log, i) => (
          <div key={i} className="mb-1 leading-relaxed whitespace-pre-wrap">
            {log.type === 'input' ? (
              <div className="flex">
                <span className="text-primary font-bold mr-2 tracking-tighter shrink-0">NEO-CODE@Quantum:~$</span>
                <span className="text-foreground">{log.text}</span>
              </div>
            ) : (
              <div className="flex">
                <span className="text-primary/30 mr-2 shrink-0">❯</span>
                <span className={cn(
                  log.type === 'success' && "text-primary",
                  log.type === 'warning' && "text-yellow-400",
                  log.type === 'error' && "text-red-400",
                  log.type === 'info' && "text-muted-foreground/90"
                )}>
                  {log.text}
                </span>
              </div>
            )}
          </div>
        ))}
        <div className="flex items-center">
          <span className="text-primary font-bold mr-2 whitespace-nowrap tracking-tighter">NEO-CODE@Quantum:~$</span>
          <input 
            ref={inputRef}
            className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-foreground" 
            autoFocus 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  )
}
