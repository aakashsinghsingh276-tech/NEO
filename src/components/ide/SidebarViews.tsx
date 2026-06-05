
"use client"

import { useState, useMemo } from "react"
import { Search, ShieldAlert, AlertTriangle, CheckCircle2, Box, Download, Check, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export function SearchSidebar({ searchQuery, onSearch }: { searchQuery: string, onSearch: (q: string) => void }) {
  const mockResults = useMemo(() => {
    if (!searchQuery) return []
    return [
      { file: 'app.tsx', line: 12, match: `import { QuantumCore } from '@neocade/core';` },
      { file: 'app.tsx', line: 15, match: `const ai = new QuantumCore();` },
      { file: 'styles.css', line: 45, match: `--primary: #00BFFF;` },
    ].filter(r => r.match.toLowerCase().includes(searchQuery.toLowerCase()) || r.file.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [searchQuery])

  return (
    <div className="w-[240px] bg-sidebar/50 border-r border-border h-full flex flex-col">
      <div className="p-3 border-b border-border">
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Search</span>
        <div className="mt-2 relative">
          <Input 
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search code..." 
            className="h-8 text-xs bg-white/5 border-white/10 pl-8"
          />
          <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-4">
          {mockResults.length > 0 ? (
            mockResults.map((res, i) => (
              <div key={i} className="group cursor-pointer hover:bg-white/5 p-2 rounded border border-transparent hover:border-primary/20 transition-all">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-primary">{res.file}</span>
                  <span className="text-[10px] text-muted-foreground">Line {res.line}</span>
                </div>
                <div className="text-[11px] font-code text-muted-foreground truncate bg-black/20 p-1 rounded">
                  {res.match}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center opacity-50">
              <Search className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-[10px] uppercase tracking-tighter">No results found</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

export function GitSidebar() {
  const [staged, setStaged] = useState<string[]>([])
  const [changes, setChanges] = useState(['app.tsx', 'styles.css', 'README.md'])
  const [commitMsg, setCommitMsg] = useState("")

  const stageFile = (file: string) => {
    setChanges(changes.filter(f => f !== file))
    setStaged([...staged, file])
  }

  const unstageFile = (file: string) => {
    setStaged(staged.filter(f => f !== file))
    setChanges([...changes, file])
  }

  return (
    <div className="w-[240px] bg-sidebar/50 border-r border-border h-full flex flex-col">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Source Control</span>
        <Badge variant="outline" className="text-[8px] border-primary/30 text-primary">GIT:MAIN</Badge>
      </div>
      <div className="p-3">
        <Input 
          placeholder="Message (Ctrl+Enter to commit)" 
          className="h-20 text-xs bg-white/5 border-white/10 resize-none items-start pt-2"
          value={commitMsg}
          onChange={(e) => setCommitMsg(e.target.value)}
        />
        <Button className="w-full mt-2 h-8 text-[10px] font-bold bg-primary hover:bg-primary/80 text-black">
          COMMIT & PUSH
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {staged.length > 0 && (
            <div className="mb-4">
              <h4 className="text-[9px] font-bold text-muted-foreground uppercase px-2 mb-1">Staged Changes</h4>
              {staged.map(file => (
                <div key={file} className="flex items-center gap-2 px-2 py-1 hover:bg-white/5 rounded text-xs group">
                  <span className="flex-1 truncate">{file}</span>
                  <button onClick={() => unstageFile(file)} className="text-primary opacity-0 group-hover:opacity-100">-</button>
                  <span className="text-[10px] text-green-400 font-bold">A</span>
                </div>
              ))}
            </div>
          )}
          <h4 className="text-[9px] font-bold text-muted-foreground uppercase px-2 mb-1">Changes</h4>
          {changes.map(file => (
            <div key={file} className="flex items-center gap-2 px-2 py-1 hover:bg-white/5 rounded text-xs group">
              <span className="flex-1 truncate">{file}</span>
              <button onClick={() => stageFile(file)} className="text-primary opacity-0 group-hover:opacity-100">+</button>
              <span className="text-[10px] text-yellow-400 font-bold">M</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

export function DebugSidebar() {
  return (
    <div className="w-[240px] bg-sidebar/50 border-r border-border h-full flex flex-col">
      <div className="p-3 border-b border-border">
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Run & Debug</span>
      </div>
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-6">
          <section>
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Variables</h4>
            <div className="space-y-1 font-code text-[11px]">
              <div className="flex justify-between px-2 py-1 bg-white/5 rounded">
                <span className="text-primary">ai_core</span>
                <span className="text-accent">Object</span>
              </div>
              <div className="flex justify-between px-2 py-1 bg-white/5 rounded">
                <span className="text-primary">quantum_state</span>
                <span className="text-green-400">Stable</span>
              </div>
              <div className="flex justify-between px-2 py-1 bg-white/5 rounded">
                <span className="text-primary">temp</span>
                <span className="text-yellow-400">34.2K</span>
              </div>
            </div>
          </section>
          
          <section>
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Watch</h4>
            <p className="text-[10px] italic text-muted-foreground px-2">No expressions watched</p>
          </section>

          <section>
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Breakpoints</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2 px-2">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-[11px]">app.tsx: 15</span>
              </div>
              <div className="flex items-center gap-2 px-2">
                <div className="h-2 w-2 rounded-full bg-red-500/30" />
                <span className="text-[11px] opacity-50 text-muted-foreground">main.ts: 102</span>
              </div>
            </div>
          </section>
        </div>
      </ScrollArea>
    </div>
  )
}

export function SecuritySidebar() {
  const [scanning, setScanning] = useState(false)
  
  const startScan = () => {
    setScanning(true)
    setTimeout(() => setScanning(false), 3000)
  }

  return (
    <div className="w-[240px] bg-sidebar/50 border-r border-border h-full flex flex-col">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Cyber Security</span>
        <ShieldAlert className="h-4 w-4 text-primary" />
      </div>
      <div className="p-3">
        <Button 
          onClick={startScan}
          disabled={scanning}
          className="w-full h-8 text-[10px] font-bold bg-accent hover:bg-accent/80 text-white"
        >
          {scanning ? "SCANNING..." : "START SYSTEM SCAN"}
        </Button>
      </div>
      <ScrollArea className="flex-1 p-3">
        {scanning ? (
          <div className="space-y-4 animate-pulse">
            {[1,2,3].map(i => <div key={i} className="h-12 bg-white/5 rounded" />)}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-2 border border-red-500/20 bg-red-500/5 rounded flex gap-3">
              <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-red-500">CRITICAL VULNERABILITY</p>
                <p className="text-[9px] text-muted-foreground">Buffer overflow in quantum_link.so</p>
              </div>
            </div>
            <div className="p-2 border border-yellow-500/20 bg-yellow-500/5 rounded flex gap-3">
              <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-yellow-500">WARNING</p>
                <p className="text-[9px] text-muted-foreground">Unencrypted port 9002 active</p>
              </div>
            </div>
            <div className="p-2 border border-green-500/20 bg-green-500/5 rounded flex gap-3">
              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-green-400">SECURE</p>
                <p className="text-[9px] text-muted-foreground">Neural-Link authentication encrypted</p>
              </div>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

export function ExtensionsSidebar({ installed, onInstall }: { installed: string[], onInstall: (id: string) => void }) {
  const languages = [
    { id: 'js', name: 'JavaScript', version: 'ES2024', desc: 'Core web functionality engine.' },
    { id: 'ts', name: 'TypeScript', version: 'v5.4', desc: 'Strictly typed web scaling.' },
    { id: 'py', name: 'Python', version: 'v3.12', desc: 'AI and backend intelligence.' },
    { id: 'java', name: 'Java', version: 'v21 JDK', desc: 'Enterprise stability platform.' },
    { id: 'cpp', name: 'C++', version: 'v17', desc: 'Low-level performance core.' },
    { id: 'go', name: 'Go', version: 'v1.24', desc: 'Cloud-native concurrency.' },
    { id: 'rs', name: 'Rust', version: 'v1.75', desc: 'Safe systems programming.' },
    { id: 'php', name: 'PHP', version: 'v8.3', desc: 'Classic web server scripts.' },
    { id: 'cs', name: 'C#', version: 'v12', desc: 'Enterprise Windows & Games.' },
    { id: 'lua', name: 'Lua', version: 'v5.4', desc: 'Embedded game scripting.' },
  ]

  const [search, setSearch] = useState('')
  const filtered = languages.filter(l => l.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="w-[240px] bg-sidebar/50 border-r border-border h-full flex flex-col">
      <div className="p-3 border-b border-border">
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Language Manager</span>
        <div className="mt-2 relative">
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search languages..." 
            className="h-8 text-xs bg-white/5 border-white/10 pl-8"
          />
          <Box className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {filtered.map(lang => (
            <div key={lang.id} className="p-3 border border-white/5 bg-white/5 rounded-xl group transition-all hover:border-primary/30">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-xs font-bold text-foreground">{lang.name}</h4>
                  <p className="text-[10px] text-muted-foreground">{lang.version}</p>
                </div>
                {installed.includes(lang.id) ? (
                  <Badge className="bg-primary/20 text-primary border-none h-5 text-[9px] uppercase">ACTIVE</Badge>
                ) : (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => onInstall(lang.id)}
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-primary"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground/80 leading-relaxed mb-3">
                {lang.desc}
              </p>
              <div className="flex items-center gap-3">
                 <div className="flex items-center gap-1 text-[8px] text-primary font-bold">
                    <Check className="h-3 w-3" /> RUNTIME READY
                 </div>
                 <div className="flex items-center gap-1 text-[8px] text-muted-foreground">
                    <Info className="h-3 w-3" /> LSP ENABLED
                 </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
