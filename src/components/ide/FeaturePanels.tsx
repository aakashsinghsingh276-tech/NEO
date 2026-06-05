
"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Cuboid, Activity, ShieldAlert, Cpu, Sparkles, Zap, BrainCircuit, Rocket, Layout, Server, Database, Github, Code2, Terminal as TerminalIcon } from "lucide-react"
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const analyticsData = [
  { name: 'Mon', val: 400 },
  { name: 'Tue', val: 300 },
  { name: 'Wed', val: 500 },
  { name: 'Thu', val: 280 },
  { name: 'Fri', val: 590 },
  { name: 'Sat', val: 320 },
  { name: 'Sun', val: 450 },
]

export function ProjectWizard({ open, onOpenChange, onComplete }: { open: boolean, onOpenChange: (open: boolean) => void, onComplete: (t: any) => void }) {
  const templates = [
    { id: 'nextjs', name: 'Next.js 15 App', icon: Layout, desc: 'Full-stack React with App Router.', color: 'text-primary' },
    { id: 'python', name: 'Python Flask API', icon: Server, desc: 'Lightweight backend intelligence.', color: 'text-accent' },
    { id: 'spring', name: 'Spring Boot Java', icon: Cpu, desc: 'Enterprise-grade microservices.', color: 'text-primary' },
    { id: 'react', name: 'React Native Mobile', icon: Rocket, desc: 'Cross-platform mobile apps.', color: 'text-green-400' },
  ]

  const [selected, setSelected] = useState<string | null>(null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel border-primary/20 sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline font-bold text-primary uppercase tracking-widest">Neural Project Wizard</DialogTitle>
          <DialogDescription className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold">Select a template to initialize your quantum workspace.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-8">
          {templates.map(t => (
            <div 
              key={t.id}
              onClick={() => setSelected(t.id)}
              className={cn(
                "p-6 border rounded-2xl cursor-pointer transition-all flex flex-col items-center text-center gap-3 bg-black/20 group",
                selected === t.id ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(0,191,255,0.2)]" : "border-white/5 hover:border-white/20"
              )}
            >
              <div className={cn("p-4 rounded-full bg-white/5 transition-transform group-hover:scale-110", t.color)}>
                <t.icon className="h-8 w-8" />
              </div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-tight">{t.name}</h4>
                <p className="text-[10px] text-muted-foreground mt-1 px-2">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter className="gap-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-[10px] uppercase font-bold">ABORT MISSION</Button>
          <Button 
            disabled={!selected} 
            onClick={() => onComplete(templates.find(t => t.id === selected))}
            className="bg-primary text-black font-bold uppercase text-[10px] tracking-widest shadow-[0_0_15px_#00BFFF]"
          >
            INITIALIZE WORKSPACE
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function NeoCADPanel() {
  return (
    <div className="flex-1 p-8 bg-black/20 flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
          <Cuboid className="h-10 w-10 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-headline font-bold text-primary uppercase tracking-tighter">NeoCAD 3D Engine</h2>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-70">Real-time GPU Accelerated Scripting V1.0</p>
        </div>
      </div>
      <Card className="flex-1 glass-panel border-primary/20 relative flex items-center justify-center overflow-hidden rounded-3xl group">
        <div className="absolute inset-0 bg-primary/5 animate-data-stream bg-[length:100%_40px] pointer-events-none opacity-40" />
        <div className="z-10 text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-primary/30 blur-[80px] rounded-full animate-pulse" />
            <div className="h-48 w-48 border-4 border-dashed border-primary/40 rounded-3xl flex items-center justify-center animate-spin-slow relative z-10">
              <Cuboid className="h-24 w-24 text-primary animate-pulse drop-shadow-[0_0_15px_#00BFFF]" />
            </div>
          </div>
          <p className="text-primary font-code animate-pulse uppercase text-xs tracking-[0.5em] font-bold">Initializing Raytracing Pipeline...</p>
        </div>
        <div className="absolute top-6 right-6 flex flex-col gap-3">
           <div className="px-4 py-2 bg-black/60 border border-primary/30 rounded-xl text-[10px] text-primary font-bold tracking-widest flex items-center gap-2">
             <Activity className="h-3 w-3" /> FPS: 144
           </div>
           <div className="px-4 py-2 bg-black/60 border border-primary/30 rounded-xl text-[10px] text-primary font-bold tracking-widest flex items-center gap-2">
             <Cpu className="h-3 w-3" /> VRAM: 4.2GB
           </div>
        </div>
        <div className="absolute bottom-8 flex gap-4">
           <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/20 text-[10px] font-bold uppercase tracking-widest px-6 h-9">WIREFRAME</Button>
           <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/20 text-[10px] font-bold uppercase tracking-widest px-6 h-9">RENDER VIEW</Button>
        </div>
      </Card>
    </div>
  )
}

export function AnalyticsPanel() {
  return (
    <div className="flex-1 p-8 bg-black/20 flex flex-col overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
          <Activity className="h-10 w-10 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-headline font-bold text-primary uppercase tracking-tighter">Project Insights</h2>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-70">Neural Productivity & Quality Analytics</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Code Quality', val: '98%', icon: BrainCircuit, color: 'text-primary' },
          { label: 'Complexity', val: 'Minimal', icon: Sparkles, color: 'text-accent' },
          { label: 'Security Score', val: 'AAA+', icon: ShieldAlert, color: 'text-primary' }
        ].map((stat, i) => (
          <Card key={i} className="glass-panel p-8 border-white/5 flex items-center gap-6 hover:border-primary/20 transition-all cursor-pointer group rounded-2xl">
            <div className={`p-4 rounded-2xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon className="h-8 w-8" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-headline font-bold text-foreground">{stat.val}</p>
            </div>
          </Card>
        ))}
      </div>
      <Card className="flex-1 glass-panel p-10 border-white/5 rounded-3xl relative overflow-hidden min-h-[450px]">
        <div className="absolute inset-0 bg-primary/[0.02] pointer-events-none" />
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-xs font-bold text-primary uppercase tracking-[0.3em]">Developer Throughput (Neural-Link Session)</h3>
          <Badge className="bg-primary/10 text-primary border-primary/20 h-6">STABLE 120ms</Badge>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData}>
              <Bar dataKey="val" radius={[8, 8, 0, 0]}>
                {analyticsData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === 4 ? 'hsl(195, 100%, 50%)' : 'rgba(255, 255, 255, 0.05)'} 
                    className="hover:fill-primary transition-colors cursor-pointer"
                  />
                ))}
              </Bar>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255, 255, 255, 0.3)', fontSize: 11, fontWeight: 'bold' }} />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'rgba(0, 191, 255, 0.05)' }} 
                contentStyle={{ backgroundColor: '#0D1117', border: '1px solid rgba(0, 191, 255, 0.2)', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}

export function QuantumReadyPanel() {
  return (
    <div className="flex-1 p-8 bg-black/20 flex flex-col items-center justify-center text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,191,255,0.08)_0%,transparent_70%)]" />
      <div className="relative mb-16 group">
        <div className="absolute inset-0 bg-primary/30 blur-[120px] rounded-full animate-pulse group-hover:bg-primary/50 transition-all" />
        <Zap className="h-32 w-32 text-primary relative z-10 animate-bounce drop-shadow-[0_0_30px_#00BFFF]" />
      </div>
      <h2 className="text-5xl font-headline font-bold text-primary mb-6 tracking-tighter uppercase drop-shadow-md">Quantum Compute Active</h2>
      <p className="text-muted-foreground max-w-lg mx-auto mb-12 text-sm leading-relaxed uppercase tracking-widest font-bold opacity-80">
        Simulating Qubits processing for edge AI robotics synchronization across multiple spatial planes.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <Card className="glass-panel p-10 border-primary/20 text-left hover:border-primary/50 transition-all cursor-pointer group hover:-translate-y-2 rounded-3xl bg-black/40">
           <Cpu className="h-10 w-10 text-primary mb-5 group-hover:scale-110 transition-transform" />
           <h4 className="font-bold text-primary uppercase text-xs tracking-widest mb-1">Squint Simulator</h4>
           <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Entanglement Error Correction Engine</p>
        </Card>
        <Card className="glass-panel p-10 border-accent/20 text-left hover:border-accent/50 transition-all cursor-pointer group hover:-translate-y-2 rounded-3xl bg-black/40">
           <Zap className="h-10 w-10 text-accent mb-5 group-hover:scale-110 transition-transform" />
           <h4 className="font-bold text-accent uppercase text-xs tracking-widest mb-1">Qubit Scheduler</h4>
           <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Hyper-dimensional Task Allocator</p>
        </Card>
      </div>
    </div>
  )
}
