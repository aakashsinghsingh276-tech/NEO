
"use client"

import { useState, useMemo } from "react"
import { Search, ShieldAlert, AlertTriangle, CheckCircle2, Box, Download, Check, Info, Database, Server, Cpu, RefreshCw, HardDrive } from "lucide-react"
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
    <div className="w-[260px] bg-sidebar/50 border-r border-border h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Project Search</span>
        <div className="mt-3 relative">
          <Input 
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search code patterns..." 
            className="h-9 text-xs bg-black/40 border-white/10 pl-9 font-code"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {mockResults.length > 0 ? (
            mockResults.map((res, i) => (
              <div key={i} className="group cursor-pointer hover:bg-white/5 p-3 rounded-lg border border-transparent hover:border-primary/20 transition-all bg-black/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">{res.file}</span>
                  <span className="text-[10px] text-muted-foreground">L{res.line}</span>
                </div>
                <div className="text-[11px] font-code text-muted-foreground truncate bg-black/40 p-1.5 rounded border border-white/5">
                  {res.match}
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center opacity-30">
              <Search className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold">No Neural Matches</p>
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
    <div className="w-[260px] bg-sidebar/50 border-r border-border h-full flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between bg-black/20">
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Source Control</span>
        <Badge variant="outline" className="text-[8px] border-primary/30 text-primary uppercase font-bold px-2 py-0">GIT:MAIN</Badge>
      </div>
      <div className="p-4 bg-black/10 border-b border-border">
        <textarea 
          placeholder="Message (Ctrl+Enter to commit)" 
          className="w-full h-20 text-xs bg-black/40 border border-white/10 rounded-lg p-3 resize-none focus:border-primary/40 outline-none font-code"
          value={commitMsg}
          onChange={(e) => setCommitMsg(e.target.value)}
        />
        <Button className="w-full mt-3 h-9 text-[10px] font-bold bg-primary hover:bg-primary/80 text-black uppercase tracking-widest">
          SYNC CHANGES
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3">
          {staged.length > 0 && (
            <div className="mb-6">
              <h4 className="text-[9px] font-bold text-muted-foreground uppercase px-2 mb-2 tracking-widest">Staged Index</h4>
              {staged.map(file => (
                <div key={file} className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg text-xs group transition-colors">
                  <span className="flex-1 truncate font-code">{file}</span>
                  <button onClick={() => unstageFile(file)} className="text-primary opacity-0 group-hover:opacity-100 font-bold hover:scale-125 transition-transform">-</button>
                  <span className="text-[10px] text-green-400 font-bold">A</span>
                </div>
              ))}
            </div>
          )}
          <h4 className="text-[9px] font-bold text-muted-foreground uppercase px-2 mb-2 tracking-widest">Untracked Deltas</h4>
          {changes.map(file => (
            <div key={file} className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg text-xs group transition-colors">
              <span className="flex-1 truncate font-code">{file}</span>
              <button onClick={() => stageFile(file)} className="text-primary opacity-0 group-hover:opacity-100 font-bold hover:scale-125 transition-transform">+</button>
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
    <div className="w-[260px] bg-sidebar/50 border-r border-border h-full flex flex-col">
      <div className="p-4 border-b border-border bg-black/20">
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Debug Console</span>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-8">
          <section>
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-3 tracking-widest flex items-center gap-2">
              <Cpu className="h-3 w-3" /> Local Variables
            </h4>
            <div className="space-y-1.5 font-code text-[11px]">
              <div className="flex justify-between px-3 py-1.5 bg-black/30 border border-white/5 rounded-md group hover:border-primary/20 transition-colors">
                <span className="text-primary">ai_core</span>
                <span className="text-accent">QuantumEngine</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-black/30 border border-white/5 rounded-md group hover:border-primary/20 transition-colors">
                <span className="text-primary">state</span>
                <span className="text-green-400">Initialized</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-black/30 border border-white/5 rounded-md group hover:border-primary/20 transition-colors">
                <span className="text-primary">load</span>
                <span className="text-yellow-400">12.4%</span>
              </div>
            </div>
          </section>
          
          <section>
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-3 tracking-widest">Watch Expressions</h4>
            <div className="p-4 border border-dashed border-white/10 rounded-lg text-center">
              <p className="text-[10px] italic text-muted-foreground">Add expressions to watch neural state...</p>
            </div>
          </section>

          <section>
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-3 tracking-widest flex items-center gap-2">
              <AlertTriangle className="h-3 w-3 text-red-500" /> Active Breakpoints
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-3 py-1.5 hover:bg-white/5 rounded-md cursor-pointer group">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                <span className="text-[11px] font-code group-hover:text-primary transition-colors">app.tsx: 24</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-1.5 hover:bg-white/5 rounded-md cursor-pointer group opacity-40">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/30" />
                <span className="text-[11px] font-code italic">main.ts: 102 (Disabled)</span>
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
    setTimeout(() => setScanning(false), 3500)
  }

  return (
    <div className="w-[260px] bg-sidebar/50 border-r border-border h-full flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between bg-black/20">
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Cyber Security</span>
        <ShieldAlert className="h-4 w-4 text-primary" />
      </div>
      <div className="p-4 border-b border-border bg-black/10">
        <Button 
          onClick={startScan}
          disabled={scanning}
          className="w-full h-10 text-[10px] font-bold bg-accent hover:bg-accent/80 text-white uppercase tracking-widest shadow-[0_0_15px_rgba(138,43,226,0.3)]"
        >
          {scanning ? "PEN-TESTING IN PROGRESS..." : "START SYSTEM AUDIT"}
        </Button>
      </div>
      <ScrollArea className="flex-1 p-4">
        {scanning ? (
          <div className="space-y-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse flex items-center px-4">
                <div className="h-2 w-2 rounded-full bg-primary/40 mr-3" />
                <div className="h-2 w-24 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 border border-red-500/20 bg-red-500/5 rounded-xl flex gap-4 transition-all hover:bg-red-500/10">
              <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-1">Critical Threat</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed">Memory leak detected in quantum_link.so binary.</p>
              </div>
            </div>
            <div className="p-4 border border-yellow-500/20 bg-yellow-500/5 rounded-xl flex gap-4 transition-all hover:bg-yellow-500/10">
              <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest mb-1">Vulnerability</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed">Unencrypted WebSocket port 9002 active.</p>
              </div>
            </div>
            <div className="p-4 border border-green-500/20 bg-green-500/5 rounded-xl flex gap-4 transition-all hover:bg-green-500/10">
              <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest mb-1">Encrypted</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed">Neural-Link authentication using RSA-4096.</p>
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
    <div className="w-[260px] bg-sidebar/50 border-r border-border h-full flex flex-col">
      <div className="p-4 border-b border-border bg-black/20">
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Language Marketplace</span>
        <div className="mt-3 relative">
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search extensions..." 
            className="h-9 text-xs bg-black/40 border-white/10 pl-9"
          />
          <Box className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {filtered.map(lang => (
            <div key={lang.id} className="p-4 border border-white/5 bg-black/20 rounded-xl group transition-all hover:border-primary/30 hover:bg-black/40">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-xs font-bold text-foreground font-headline uppercase tracking-tight">{lang.name}</h4>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-tighter opacity-70">{lang.version}</p>
                </div>
                {installed.includes(lang.id) ? (
                  <Badge className="bg-primary/20 text-primary border-none h-5 text-[9px] uppercase font-bold">READY</Badge>
                ) : (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => onInstall(lang.id)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground/80 leading-relaxed mb-4 italic">
                {lang.desc}
              </p>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-1.5 text-[8px] text-primary font-bold uppercase tracking-widest">
                    <Check className="h-3 w-3" /> RUNTIME ACTIVE
                 </div>
                 <div className="flex items-center gap-1.5 text-[8px] text-muted-foreground uppercase">
                    <Info className="h-3 w-3" /> LSP LOADED
                 </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

export function DatabaseSidebar() {
  const [instances, setInstances] = useState([
    { id: 'pg-1', name: 'Production-DB', type: 'PostgreSQL', status: 'Active', load: '12%' },
    { id: 'mongo-1', name: 'User-Meta', type: 'MongoDB', status: 'Idle', load: '2%' },
    { id: 'redis-1', name: 'Cache-Cluster', type: 'Redis', status: 'Active', load: '45%' },
  ])

  return (
    <div className="w-[260px] bg-sidebar/50 border-r border-border h-full flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between bg-black/20">
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Database Studio</span>
        <Database className="h-4 w-4 text-primary" />
      </div>
      <div className="p-4 border-b border-border bg-black/10">
        <Button variant="outline" className="w-full h-9 text-[10px] font-bold border-primary/20 text-primary hover:bg-primary/10 uppercase tracking-widest">
          CONNECT NEW INSTANCE
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {instances.map(inst => (
            <div key={inst.id} className="p-4 border border-white/5 bg-black/30 rounded-xl group hover:border-primary/40 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Server className="h-3.5 w-3.5 text-primary" />
                  <h4 className="text-[11px] font-bold text-foreground font-code">{inst.name}</h4>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={cn("h-1.5 w-1.5 rounded-full", inst.status === 'Active' ? 'bg-green-500 shadow-[0_0_5px_#22c55e]' : 'bg-slate-500')} />
                  <span className="text-[9px] uppercase text-muted-foreground font-bold">{inst.status}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                 <div className="bg-black/40 p-1.5 rounded-md border border-white/5 flex flex-col">
                    <span className="text-[8px] text-muted-foreground uppercase mb-0.5">Engine</span>
                    <span className="text-primary truncate">{inst.type}</span>
                 </div>
                 <div className="bg-black/40 p-1.5 rounded-md border border-white/5 flex flex-col">
                    <span className="text-[8px] text-muted-foreground uppercase mb-0.5">IOPS Load</span>
                    <span className="text-accent">{inst.load}</span>
                 </div>
              </div>
              <div className="mt-4 flex gap-2">
                 <Button variant="ghost" size="sm" className="h-7 flex-1 text-[9px] uppercase font-bold hover:bg-white/5">BROWSE</Button>
                 <Button variant="ghost" size="sm" className="h-7 flex-1 text-[9px] uppercase font-bold hover:bg-white/5">QUERY</Button>
              </div>
            </div>
          ))}
          <div className="p-6 border border-dashed border-white/10 rounded-xl text-center flex flex-col items-center justify-center opacity-40">
             <RefreshCw className="h-6 w-6 text-muted-foreground mb-2" />
             <p className="text-[9px] uppercase font-bold tracking-widest">Refreshing Clusters...</p>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
