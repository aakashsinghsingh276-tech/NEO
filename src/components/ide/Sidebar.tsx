"use client"

import { 
  Files, 
  Search, 
  GitBranch, 
  Play, 
  Box, 
  ShieldAlert, 
  Settings, 
  LayoutDashboard,
  Cpu,
  Cuboid,
  Activity,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const menuItems = [
  { id: 'explorer', icon: Files, label: 'Explorer' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'git', icon: GitBranch, label: 'Source Control' },
  { id: 'run', icon: Play, label: 'Run & Debug' },
  { id: 'neocad', icon: Cuboid, label: 'NeoCAD 3D' },
  { id: 'quantum', icon: Zap, label: 'Quantum Ready' },
  { id: 'security', icon: ShieldAlert, label: 'Cyber Security' },
  { id: 'analytics', icon: Activity, label: 'Analytics' },
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' }
]

export function Sidebar({ activeId, onActiveChange }: { 
  activeId: string, 
  onActiveChange: (id: string) => void 
}) {
  return (
    <div className="w-[60px] bg-sidebar border-r border-border flex flex-col items-center py-4 gap-6 z-40">
      <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary text-black mb-4 group cursor-pointer hover:rotate-90 transition-transform">
        <Cpu className="h-6 w-6" />
      </div>

      <TooltipProvider delayDuration={0}>
        <div className="flex flex-col gap-4 flex-1">
          {menuItems.map((item) => (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onActiveChange(item.id)}
                  className={cn(
                    "p-3 rounded-xl transition-all relative group",
                    activeId === item.id 
                      ? "bg-primary/10 text-primary shadow-[0_0_10px_rgba(165,255,0,0.1)]" 
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", activeId === item.id && "drop-shadow-[0_0_2px_currentColor]")} />
                  {activeId === item.id && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-popover border-border text-xs">
                {item.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>

      <button className="p-3 text-muted-foreground hover:text-foreground mt-auto">
        <Settings className="h-5 w-5" />
      </button>
    </div>
  )
}
