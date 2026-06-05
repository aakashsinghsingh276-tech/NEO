"use client"

import { Search, Mic, Wifi, Battery, Maximize2, Cpu, File, Edit, Play, Terminal, HelpCircle, Layout, Globe, Shield, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function TopNav({ onSearch, onAction }: { onSearch?: (query: string) => void, onAction?: (action: string) => void }) {
  const menuItems = [
    { label: 'File', icon: <File className="h-3 w-3" />, actions: ['new-file', 'new-folder', 'open-folder', 'save', 'save-as', 'delete'] },
    { label: 'Edit', icon: <Edit className="h-3 w-3" />, actions: ['undo', 'redo', 'cut', 'copy', 'paste'] },
    { label: 'Run', icon: <Play className="h-3 w-3" />, actions: ['start-debug', 'run-without-debug'] },
    { label: 'Terminal', icon: <Terminal className="h-3 w-3" />, actions: ['new-terminal', 'split-terminal'] },
    { label: 'Help', icon: <HelpCircle className="h-3 w-3" />, actions: ['about', 'documentation'] }
  ]

  return (
    <header className="h-10 bg-sidebar border-b border-border flex items-center px-4 gap-6 select-none z-50">
      <div className="flex items-center gap-2">
        <Cpu className="h-4 w-4 text-primary" />
        <span className="text-[11px] font-bold tracking-[0.2em] text-primary">NEO CODE</span>
      </div>

      <nav className="hidden md:flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
        {menuItems.map(m => (
          <DropdownMenu key={m.label}>
            <DropdownMenuTrigger asChild>
              <button className="px-2 py-1 hover:text-primary hover:bg-white/5 rounded transition-all flex items-center gap-1.5 outline-none uppercase tracking-tighter">
                {m.label}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="glass-panel border-primary/20 text-xs min-w-[160px]">
              <DropdownMenuLabel className="text-[10px] text-primary/50 uppercase">{m.label} OPTIONS</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5" />
              {m.actions.map(action => (
                <DropdownMenuItem 
                  key={action} 
                  onClick={() => onAction?.(action)}
                  className="hover:bg-primary/10 hover:text-primary cursor-pointer capitalize py-2"
                >
                  {action.replace('-', ' ')}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ))}
      </nav>

      <div className="flex-1 flex justify-center">
        <div className="max-w-[400px] w-full relative flex items-center group">
          <Search className="absolute left-3 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            className="w-full h-7 bg-white/5 border border-white/10 rounded-md px-10 text-[11px] focus:outline-none focus:border-primary/40 focus:bg-white/10 transition-all"
            placeholder="Search projects, files, or quantum commands..."
            onChange={(e) => onSearch?.(e.target.value)}
          />
          <Mic className="absolute right-3 h-3.5 w-3.5 text-muted-foreground hover:text-primary cursor-pointer" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-code">
          <Wifi className="h-3.5 w-3.5 text-primary" />
          <span>12:00:54</span>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary">
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
