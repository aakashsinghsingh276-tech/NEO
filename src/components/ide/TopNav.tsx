
"use client"

import { Search, Mic, Wifi, Battery, Maximize2, Cpu, File, Edit, Play, Terminal, HelpCircle, Layout, Globe, Shield, ChevronDown, Package, GitBranch, TerminalSquare, Settings2, Sparkles, Download, Database, Box } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function TopNav({ onSearch, onAction }: { onSearch?: (query: string) => void, onAction?: (action: string) => void }) {
  const menuItems = [
    { label: 'File', icon: <File className="h-3 w-3" />, actions: ['new-file', 'new-folder', 'new-project', 'save', 'save-as', 'export-project', 'delete'] },
    { label: 'Edit', icon: <Edit className="h-3 w-3" />, actions: ['undo', 'redo', 'cut', 'copy', 'paste', 'find-in-files'] },
    { label: 'Run', icon: <Play className="h-3 w-3" />, actions: ['start-debug', 'run-without-debug', 'attach-process', 'stop-debug'] },
    { label: 'Terminal', icon: <Terminal className="h-3 w-3" />, actions: ['new-terminal', 'split-terminal', 'kill-active'] },
    { label: 'Database', icon: <Database className="h-3 w-3" />, actions: ['setup-db', 'view-clusters', 'query-history'] },
    { label: 'Quantum', icon: <Sparkles className="h-3 w-3" />, actions: ['entangle-workspace', 'simulate-qubits', 'ai-refactor-project'] },
    { label: 'Help', icon: <HelpCircle className="h-3 w-3" />, actions: ['about', 'documentation', 'keyboard-shortcuts'] }
  ]

  return (
    <header className="h-12 bg-sidebar border-b border-border flex items-center px-6 gap-8 select-none z-50 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
      <div className="flex items-center gap-3 group cursor-pointer">
        <div className="p-1.5 bg-primary/10 rounded-lg group-hover:rotate-90 transition-all border border-primary/20">
          <Cpu className="h-5 w-5 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-[12px] font-bold tracking-[0.3em] text-primary font-headline">NEO CODE</span>
          <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-tighter opacity-70">Quantum V1.0</span>
        </div>
      </div>

      <nav className="hidden lg:flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
        {menuItems.map(m => (
          <DropdownMenu key={m.label}>
            <DropdownMenuTrigger asChild>
              <button className="px-3 py-1.5 hover:text-primary hover:bg-white/5 rounded-md transition-all flex items-center gap-2 outline-none uppercase tracking-widest border border-transparent hover:border-white/5">
                {m.label}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="glass-panel border-primary/20 text-[11px] min-w-[200px] p-2 rounded-xl">
              <DropdownMenuLabel className="text-[9px] text-primary/50 uppercase tracking-[0.2em] px-3 py-2">MODULAR {m.label} COMMANDS</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5 mx-2" />
              {m.actions.map(action => (
                <DropdownMenuItem 
                  key={action} 
                  onClick={() => onAction?.(action)}
                  className="hover:bg-primary/10 hover:text-primary cursor-pointer capitalize py-2.5 px-3 rounded-lg flex items-center gap-3 transition-colors"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                  {action.replace(/-/g, ' ')}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ))}
      </nav>

      <div className="flex-1 flex justify-center px-4">
        <div className="max-w-[500px] w-full relative flex items-center group">
          <Search className="absolute left-4 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            className="w-full h-9 bg-black/40 border border-white/10 rounded-xl px-12 text-[12px] focus:outline-none focus:border-primary/40 focus:bg-black/60 transition-all font-code text-foreground placeholder:text-muted-foreground/50"
            placeholder="Search files, components, or neural segments..."
            onChange={(e) => onSearch?.(e.target.value)}
          />
          <Mic className="absolute right-4 h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer" />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-code bg-black/20 px-4 py-1.5 rounded-full border border-white/5">
          <Wifi className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-primary font-bold">LIVE</span>
          <span className="opacity-60">CLOUD-ACTIVE</span>
        </div>
        <div className="flex items-center gap-3">
           <TooltipProvider>
             <Tooltip>
               <TooltipTrigger asChild>
                 <Button 
                   variant="ghost" 
                   size="icon" 
                   onClick={() => onAction?.('install-all-languages')} 
                   className="h-9 w-9 hover:text-primary hover:bg-white/5 rounded-full text-accent"
                 >
                   <Box className="h-4 w-4" />
                 </Button>
               </TooltipTrigger>
               <TooltipContent className="text-[10px] uppercase font-bold tracking-widest bg-popover border-border">
                 Sync All Language SDKs
               </TooltipContent>
             </Tooltip>
           </TooltipProvider>

           <TooltipProvider>
             <Tooltip>
               <TooltipTrigger asChild>
                 <Button 
                   variant="ghost" 
                   size="icon" 
                   onClick={() => onAction?.('export-project')} 
                   className="h-9 w-9 hover:text-primary hover:bg-white/5 rounded-full"
                 >
                   <Download className="h-4 w-4" />
                 </Button>
               </TooltipTrigger>
               <TooltipContent className="text-[10px] uppercase font-bold tracking-widest bg-popover border-border">
                 Export Workspace
               </TooltipContent>
             </Tooltip>
           </TooltipProvider>

           <Button variant="ghost" size="icon" className="h-9 w-9 hover:text-primary hover:bg-white/5 rounded-full">
             <Settings2 className="h-4 w-4" />
           </Button>
        </div>
      </div>
    </header>
  )
}
