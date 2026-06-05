
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
  Zap,
  Database
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const menuItems = [
  { id: 'explorer', icon: Files, label: 'Explorer' },
  { id: 'search', icon: Search, label: 'Global Search' },
  { id: 'git', icon: GitBranch, label: 'Source Control' },
  { id: 'extensions', icon: Box, label: 'Extensions & SDKs' },
  { id: 'run', icon: Play, label: 'Debug Console' },
  { id: 'database', icon: Database, label: 'Database Studio' },
  { id: 'neocad', icon: Cuboid, label: 'NeoCAD 3D' },
  { id: 'quantum', icon: Zap, label: 'Quantum Ready' },
  { id: 'security', icon: ShieldAlert, label: 'Cyber Security' },
  { id: 'analytics', icon: Activity, label: 'Project Insights' }
]

export function Sidebar({ activeId, onActiveChange }: { 
  activeId: string, 
  onActiveChange: (id: string) => void 
}) {
  return (
    <div className="w-[60px] bg-sidebar border-r border-border flex flex-col items-center py-4 gap-6 z-40">
      <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary text-black mb-4 group cursor-pointer hover:rotate-90 transition-transform shadow-[0_0_15px_rgba(0,191,255,0.4)]">
        <Cpu className="h-6 w-6" />
      </div>

      <TooltipProvider delayDuration={0}>
        <div className="flex flex-col gap-5 flex-1">
          {menuItems.map((item) => (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onActiveChange(item.id)}
                  className={cn(
                    "p-3 rounded-xl transition-all relative group",
                    activeId === item.id 
                      ? "bg-primary/10 text-primary shadow-[0_0_10px_rgba(0,191,255,0.1)]" 
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", activeId === item.id && "drop-shadow-[0_0_2px_currentColor]")} />
                  {activeId === item.id && (
                    <div className="absolute left-[-14px] top-1/2 -translate-y-1/2 w-1.5 h-7 bg-primary rounded-r-full shadow-[0_0_10px_#00BFFF]" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-popover border-border text-[10px] uppercase font-bold tracking-widest px-3 py-1.5">
                {item.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>

      <button className="p-3 text-muted-foreground hover:text-foreground mt-auto hover:rotate-45 transition-transform">
        <Settings className="h-5 w-5" />
      </button>
    </div>
  )
}
