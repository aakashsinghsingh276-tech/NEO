
"use client"

import { useState, useRef, useEffect } from "react"
import { Terminal as TerminalIcon, Shield, Cpu, RefreshCw, X, Plus, ChevronDown, Play, Square, Trash2, Command, Globe, Hash } from "lucide-react"
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
    },
    { 
      id: 'term-bash', 
      name: 'bash', 
      logs: [{ type: 'info', text: 'Quantum Shell v5.8 active. Ready for input.' }] 
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
      logs: [{ type: 'info', text: `Quantum Session established [${newId.split('-')[1].slice(-4)}]` }] 
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
        newLogs.push({ type: 'info', text: 'Commands: help, status, clear, run, neofetch, docker-ps, git-log, npm-list' })
      } else if (cmd === 'clear') {
        updateActiveLogs([])
        setInput("")
        return
      } else if (cmd === 'status') {
        newLogs.push({ type: 'success', text: 'NEURAL CORE: OPTIMIZED | IOPS: 4.2k | LATENCY: 0.1ms | UPTIME: 14h 23m' })
      } else if (cmd === 'run') {
        setIsRunning(true)
        const ext = activeFile?.split('.').pop() || 'js'
        const baseName = activeFile?.split('.')[0] || 'app'
        const runCmdTemplate = LANGUAGE_RUN_COMMANDS[ext] || 'node'
        const runCmd = runCmdTemplate.replace('%f', activeFile || 'app.js').replace('%n', baseName)
        
        newLogs.push({ type: 'info', text: `Executing via Quantum Engine: ${runCmd}` })
        setTimeout(() => {
           newLogs.push({ type: 'success', text: `[${activeFile}] Process exited successfully with status 0.` })
           setIsRunning(false)
           updateActiveLogs([...newLogs])
        }, 1200)
      } else if (cmd === 'neofetch') {
        newLogs.push({ type: 'info', text: 'OS: NEO CODE Quantum v1.0\nKernel: 5.15.0-quantum\nUptime: 14 hours\nPackages: 1337 (apt)\nShell: quantum-zsh 5.8\nCPU: AMD EPYC (Neural Link)\nGPU: Simulated-X 4090 v2\nMemory: 32GiB HBM3' })
      } else if (cmd.startsWith('npm') || cmd.startsWith('pip')) {
        newLogs.push({ type: 'info', text: `Synchronizing neural packages for workspace...` })
        setTimeout(() => {
           newLogs.push({ type: 'success', text: `Dependencies resolved and synchronized.` })
           updateActiveLogs([...newLogs, { type: 'info', text: 'Integrity checks passed.' }])
        }, 1500)
      } else {
        newLogs.push({ type: 'error', text: `QuantumShell: Neural mapping failed for command: ${cmd}` })
      }
      
      updateActiveLogs(newLogs)
      setInput("")
    }
  }

  const updateActiveLogs = (newLogs: any) => {
    setTerminals(prev => prev.map(t => t.id === activeId ? { ...t, logs: newLogs } : t))
  }

  return (
    <div className="h-[320px] border-t border-border bg-[#0a0d12] flex flex-col font-code">
      <div className="flex items-center px-4 bg-sidebar/40 border-b border-border h-10 justify-between">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1 h-full">
          {terminals.map((t) => (
            <div
              key={t.id}
              onClick={() => setActiveId(t.id)}
              className={cn(
                "flex items-center gap-2.5 px-4 h-full text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 cursor-pointer group whitespace-nowrap",
                activeId === t.id 
                  ? "text-primary border-primary bg-primary/5" 
                  : "text-muted-foreground border-transparent hover:text-foreground hover:bg-white/5"
              )}
            >
              <TerminalIcon className="h-3.5 w-3.5" />
              {t.name}
              <button 
                onClick={(e) => { e.stopPropagation(); killTerminal(t.id); }}
                className="ml-2 opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-4 pl-6 border-l border-border/50 ml-2">
           <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                    setInput('run')
                    const event = { key: 'Enter', preventDefault: () => {}, target: { value: 'run' } } as any
                    handleCommand(event)
                }} 
                className={cn("flex items-center gap-2 px-3 py-1 rounded-md transition-all text-[10px] font-bold uppercase tracking-widest border border-primary/20 hover:bg-primary/10", isRunning ? "text-red-400 border-red-500/20" : "text-primary")}
              >
                {isRunning ? <Square className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-primary" />}
                {isRunning ? "STOP" : "RUN"}
              </button>
           </div>
           
           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1.5 hover:bg-white/10 rounded-md text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 border border-white/5">
                  <Plus className="h-4 w-4" />
                  <ChevronDown className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-panel border-primary/20 text-[10px] min-w-[180px] p-2 rounded-xl">
                <DropdownMenuItem onClick={() => addTerminal('bash')} className="uppercase font-bold gap-3 py-2 rounded-lg">
                  <TerminalIcon className="h-4 w-4 text-primary" /> New Bash Session
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addTerminal('node')} className="uppercase font-bold gap-3 py-2 rounded-lg">
                  <Cpu className="h-4 w-4 text-accent" /> New Node Runtime
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addTerminal('python')} className="uppercase font-bold gap-3 py-2 rounded-lg">
                  <Hash className="h-4 w-4 text-green-400" /> New Python Shell
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addTerminal('docker')} className="uppercase font-bold gap-3 py-2 rounded-lg">
                  <Globe className="h-4 w-4 text-blue-400" /> New Docker Console
                </DropdownMenuItem>
              </DropdownMenuContent>
           </DropdownMenu>
           <button onClick={() => updateActiveLogs([])} className="p-1.5 hover:bg-white/10 rounded-md transition-colors" title="Clear Console">
             <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-400" />
           </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 p-5 text-[13px] overflow-y-auto custom-scrollbar bg-black/40 relative"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="absolute top-4 right-6 opacity-20 pointer-events-none select-none">
           <Command className="h-32 w-32 text-primary" />
        </div>
        {activeTerm.logs.map((log, i) => (
          <div key={i} className="mb-2 leading-relaxed whitespace-pre-wrap">
            {log.type === 'input' ? (
              <div className="flex">
                <span className="text-primary font-bold mr-3 tracking-tighter shrink-0">NEO-CODE@Quantum:~$</span>
                <span className="text-foreground">{log.text}</span>
              </div>
            ) : (
              <div className="flex">
                <span className="text-primary/40 mr-3 shrink-0">❯</span>
                <span className={cn(
                  "font-medium",
                  log.type === 'success' && "text-primary drop-shadow-[0_0_2px_#00BFFF]",
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
          <span className="text-primary font-bold mr-3 whitespace-nowrap tracking-tighter">NEO-CODE@Quantum:~$</span>
          <input 
            ref={inputRef}
            className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-foreground caret-primary" 
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
