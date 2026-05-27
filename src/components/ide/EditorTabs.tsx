"use client"

import { X, FileCode, Braces, Terminal } from "lucide-react"
import { cn } from "@/lib/utils"

interface Tab {
  id: string
  name: string
  icon: React.ReactNode
  active: boolean
}

export function EditorTabs({ tabs, onTabClick, onTabClose }: { 
  tabs: Tab[], 
  onTabClick: (id: string) => void,
  onTabClose: (id: string) => void
}) {
  return (
    <div className="flex bg-sidebar border-b border-border overflow-x-auto no-scrollbar">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          onClick={() => onTabClick(tab.id)}
          className={cn(
            "group flex items-center gap-2 px-4 py-2 text-sm cursor-pointer border-r border-border transition-all min-w-[120px]",
            tab.active 
              ? "bg-background text-primary border-t-2 border-t-primary" 
              : "text-muted-foreground hover:bg-white/5"
          )}
        >
          <span className={cn(tab.active ? "text-primary" : "text-muted-foreground")}>
            {tab.icon}
          </span>
          <span className="truncate">{tab.name}</span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onTabClose(tab.id);
            }}
            className="ml-auto p-0.5 rounded-sm hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  )
}