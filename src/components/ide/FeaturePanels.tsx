
"use client"

import { Card } from "@/components/ui/card"
import { Cuboid, Activity, ShieldAlert, Cpu, Sparkles, Zap, BrainCircuit } from "lucide-react"
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"

const analyticsData = [
  { name: 'Mon', val: 400 },
  { name: 'Tue', val: 300 },
  { name: 'Wed', val: 500 },
  { name: 'Thu', val: 280 },
  { name: 'Fri', val: 590 },
  { name: 'Sat', val: 320 },
  { name: 'Sun', val: 450 },
]

export function NeoCADPanel() {
  return (
    <div className="flex-1 p-8 bg-black/20 flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <Cuboid className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-2xl font-headline font-bold text-primary">NeoCAD 3D Engine</h2>
          <p className="text-sm text-muted-foreground">Real-time GPU Accelerated CAD Scripting</p>
        </div>
      </div>
      <Card className="flex-1 glass-panel border-primary/20 relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 animate-data-stream bg-[length:100%_20px] pointer-events-none" />
        <div className="z-10 text-center">
          <div className="h-32 w-32 border-4 border-primary/30 rounded-lg flex items-center justify-center mb-4 animate-spin-slow">
            <Cuboid className="h-16 w-16 text-primary animate-pulse" />
          </div>
          <p className="text-primary font-code animate-pulse uppercase text-xs tracking-widest">Initializing OpenGL Context...</p>
        </div>
        <div className="absolute bottom-4 right-4 flex gap-2">
           <button className="px-3 py-1 bg-primary/10 border border-primary/30 rounded text-[10px] text-primary hover:bg-primary/20 transition-colors">WIREFRAME</button>
           <button className="px-3 py-1 bg-primary/10 border border-primary/30 rounded text-[10px] text-primary hover:bg-primary/20 transition-colors">GPU STATS</button>
        </div>
      </Card>
    </div>
  )
}

export function AnalyticsPanel() {
  return (
    <div className="flex-1 p-8 bg-black/20 flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-2xl font-headline font-bold text-primary">Smart Project Analytics</h2>
          <p className="text-sm text-muted-foreground">AI Powered Productivity Insights</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Code Quality', val: '98%', icon: BrainCircuit, color: 'text-primary' },
          { label: 'Complexity', val: 'Low', icon: Sparkles, color: 'text-accent' },
          { label: 'Security Score', val: 'A+', icon: ShieldAlert, color: 'text-primary' }
        ].map((stat, i) => (
          <Card key={i} className="glass-panel p-6 border-white/5 flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">{stat.label}</p>
              <p className="text-xl font-headline font-bold">{stat.val}</p>
            </div>
          </Card>
        ))}
      </div>
      <Card className="flex-1 glass-panel p-6 border-white/5">
        <h3 className="text-sm font-bold text-primary mb-6 uppercase tracking-widest">Developer Throughput (Neural-Link)</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData}>
              <Bar dataKey="val">
                {analyticsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 4 ? 'hsl(195, 100%, 50%)' : 'rgba(255, 255, 255, 0.05)'} />
                ))}
              </Bar>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255, 255, 255, 0.2)', fontSize: 10 }} />
              <YAxis hide />
              <Tooltip cursor={{ fill: 'rgba(0, 191, 255, 0.05)' }} contentStyle={{ backgroundColor: '#0D1117', border: '1px solid rgba(0, 191, 255, 0.2)', borderRadius: '8px' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}

export function QuantumReadyPanel() {
  return (
    <div className="flex-1 p-8 bg-black/20 flex flex-col items-center justify-center text-center">
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full animate-pulse" />
        <Zap className="h-24 w-24 text-primary relative z-10 animate-bounce" />
      </div>
      <h2 className="text-4xl font-headline font-bold text-primary mb-4 tracking-tighter uppercase">Quantum Compute Active</h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        Simulation environment primed for Qubits processing and edge AI robotics synchronization.
      </p>
      <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
        <Card className="glass-panel p-6 border-primary/20 text-left hover:border-primary/40 transition-colors cursor-pointer group">
           <Cpu className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
           <h4 className="font-bold text-primary uppercase text-xs">Squint Simulator</h4>
           <p className="text-[10px] text-muted-foreground">Quantum Simulation Engine</p>
        </Card>
        <Card className="glass-panel p-6 border-accent/20 text-left hover:border-accent/40 transition-colors cursor-pointer group">
           <Zap className="h-8 w-8 text-accent mb-3 group-hover:scale-110 transition-transform" />
           <h4 className="font-bold text-accent uppercase text-xs">Qubit Scheduler</h4>
           <p className="text-[10px] text-muted-foreground">Quantum Scheduling Algorithm</p>
        </Card>
      </div>
    </div>
  )
}
