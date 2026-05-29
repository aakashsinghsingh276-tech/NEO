"use client"

import { useState } from "react"
import { Sidebar } from "@/components/ide/Sidebar"
import { TopNav } from "@/components/ide/TopNav"
import { ProjectExplorer } from "@/components/ide/ProjectExplorer"
import { EditorTabs } from "@/components/ide/EditorTabs"
import { CodeEditor } from "@/components/ide/CodeEditor"
import { TerminalView } from "@/components/ide/TerminalView"
import { AIAssistant } from "@/components/ide/AIAssistant"
import { FileCode, Braces, Terminal } from "lucide-react"
import { NeoCADPanel, AnalyticsPanel, QuantumReadyPanel } from "@/components/ide/FeaturePanels"

const initialTabs = [
  { id: '1', name: 'app.tsx', icon: <FileCode className="h-4 w-4" />, active: true },
  { id: '2', name: 'styles.css', icon: <Braces className="h-4 w-4" />, active: false },
  { id: '3', name: 'terminal.sh', icon: <Terminal className="h-4 w-4" />, active: false }
]

const initialCode = `/**
 * NEOCADE v1.0.0
 * Quantum AI Platform
 */

import { QuantumCore } from '@neocade/core';

async function main() {
  const ai = new QuantumCore();
  
  // Initialize AI Reasoning
  await ai.initialize({
    mode: 'Jarvis',
    acceleration: 'Quantum'
  });

  console.log("Systems Online. Hello World.");
}

main();
`

export default function IDEPage() {
  const [activeSidebarTab, setActiveSidebarTab] = useState('explorer')
  const [tabs, setTabs] = useState(initialTabs)
  const [code, setCode] = useState(initialCode)
  const [searchQuery, setSearchQuery] = useState('')

  const handleTabClick = (id: string) => {
    setTabs(tabs.map(t => ({ ...t, active: t.id === id })))
  }

  const handleTabClose = (id: string) => {
    setTabs(tabs.filter(t => t.id !== id))
  }

  const renderContent = () => {
    switch(activeSidebarTab) {
      case 'neocad':
        return <NeoCADPanel />
      case 'analytics':
        return <AnalyticsPanel />
      case 'quantum':
        return <QuantumReadyPanel />
      default:
        return (
          <div className="flex-1 flex flex-col overflow-hidden">
            <EditorTabs tabs={tabs} onTabClick={handleTabClick} onTabClose={handleTabClose} />
            <CodeEditor code={code} language="typescript" onChange={setCode} />
          </div>
        )
    }
  }

  return (
    <main className="h-screen w-screen flex flex-col overflow-hidden bg-background text-foreground">
      <TopNav onSearch={setSearchQuery} />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeId={activeSidebarTab} onActiveChange={setActiveSidebarTab} />
        
        {activeSidebarTab === 'explorer' && <ProjectExplorer searchQuery={searchQuery} />}
        
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {renderContent()}
          <TerminalView />
        </div>
      </div>

      <AIAssistant />

      {/* Footer Status Bar */}
      <footer className="h-6 bg-primary text-black flex items-center px-4 justify-between text-[10px] font-bold tracking-wider uppercase select-none z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
             <div className="h-2 w-2 rounded-full bg-black animate-pulse" />
             QUANTUM-READY
          </div>
          <span>LN 1, COL 1</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center gap-4">
          <span>POLYGLOT ENGINE: TYPESCRIPT 5.2</span>
          <span>NEURAL-LINK ACTIVE</span>
          <div className="flex items-center gap-1 bg-black text-primary px-2 py-0.5 rounded-sm">
             OS INTEGRATION: STABLE
          </div>
        </div>
      </footer>
    </main>
  )
}
