"use client"

import { Menu, Search, Mic, Wifi, Battery, Maximize2, Cpu } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TopNav({ onSearch }: { onSearch?: (query: string) => void }) {
  return (
    <header className="h-10 bg-sidebar border-b border-border flex items-center px-4 gap-6 select-none z-50">
      <div className="flex items-center gap-2">
        <Cpu className="h-4 w-4 text-primary" />
        <span className="text-[11px] font-bold tracking-[0.2em] text-primary">NEOCADE</span>
      </div>

      <nav className="hidden md:flex items-center gap-4 text-xs font-medium text-muted-foreground">
        {['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Quantum', 'Help'].map(m => (
          <button key={m} className="hover:text-primary transition-colors">{m}</button>
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
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Wifi className="h-3.5 w-3.5 text-primary" />
          <Battery className="h-3.5 w-3.5" />
          <span className="font-code">12:00:54</span>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary">
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
