
"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { Sidebar } from "@/components/ide/Sidebar"
import { TopNav } from "@/components/ide/TopNav"
import { ProjectExplorer } from "@/components/ide/ProjectExplorer"
import { SearchSidebar, GitSidebar, DebugSidebar, SecuritySidebar, ExtensionsSidebar, DatabaseSidebar } from "@/components/ide/SidebarViews"
import { EditorTabs } from "@/components/ide/EditorTabs"
import { CodeEditor, getLanguageFromFileName } from "@/components/ide/CodeEditor"
import { TerminalView } from "@/components/ide/TerminalView"
import { AIAssistant } from "@/components/ide/AIAssistant"
import { FileCode, FileText, Globe, X, Play, Shield, RefreshCw, Layers, Database, Code2 } from "lucide-react"
import { NeoCADPanel, AnalyticsPanel, QuantumReadyPanel, ProjectWizard } from "@/components/ide/FeaturePanels"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export interface FileNode {
  id: string
  name: string
  type: 'file' | 'folder'
  children?: FileNode[]
  isOpen?: boolean
  content?: string
}

const initialFiles: FileNode[] = [
  {
    id: 'src',
    name: 'src',
    type: 'folder',
    isOpen: true,
    children: [
      { id: 'app.tsx', name: 'app.tsx', type: 'file', content: 'import React from "react";\n\nexport default function App() {\n  return (\n    <div className="p-8 bg-slate-900 text-white min-h-screen flex items-center justify-center font-code">\n      <h1 className="text-4xl font-bold text-blue-400">Hello NEO CODE!</h1>\n      <p className="mt-4 text-slate-400">Quantum Intelligence Powered IDE</p>\n    </div>\n  );\n}' },
      { id: 'styles.css', name: 'styles.css', type: 'file', content: 'body {\n  background: #0D1117;\n  color: #00BFFF;\n  font-family: "Space Grotesk", sans-serif;\n}\n\n.neon-glow {\n  text-shadow: 0 0 10px rgba(0, 191, 255, 0.5);\n}' }
    ]
  },
  { id: 'README.md', name: 'README.md', type: 'file', content: '# NEO CODE Project\n\nQuantum-ready workspace powered by GenAI.\n\n## Features\n- Polyglot Runtime\n- AI Architect Core\n- Integrated Terminal\n- Git Source Control' }
]

export default function IDEPage() {
  const [activeSidebarTab, setActiveSidebarTab] = useState('explorer')
  const [files, setFiles] = useState<FileNode[]>(initialFiles)
  const [tabs, setTabs] = useState<{id: string, name: string, icon: any, active: boolean}[]>([
    { id: 'app.tsx', name: 'app.tsx', icon: <FileCode className="h-4 w-4" />, active: true }
  ])
  const [selectedId, setSelectedId] = useState<string | null>('app.tsx')
  const [searchQuery, setSearchQuery] = useState('')
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(true)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [installedLanguages, setInstalledLanguages] = useState<string[]>(['js', 'ts', 'py'])
  const [activeModel, setActiveModel] = useState('DeepSeek-V3')
  const [terminalHeight, setTerminalHeight] = useState(300)
  const [isDraggingTerminal, setIsDraggingTerminal] = useState(false)
  
  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [createType, setCreateType] = useState<'file' | 'folder'>('file')
  const [newItemName, setNewItemName] = useState('')

  const { toast } = useToast()

  const activeFile = useMemo(() => {
    const findFile = (nodes: FileNode[], id: string): FileNode | null => {
      for (const node of nodes) {
        if (node.id === id) return node
        if (node.children) {
          const found = findFile(node.children, id)
          if (found) return found
        }
      }
      return null
    }
    return findFile(files, tabs.find(t => t.active)?.id || '')
  }, [files, tabs])

  const handleUpdateCode = (newCode: string) => {
    const updateInTree = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.id === activeFile?.id) return { ...node, content: newCode }
        if (node.children) return { ...node, children: updateInTree(node.children) }
        return node
      })
    }
    setFiles(updateInTree(files))
  }

  const handleTabClick = (id: string) => {
    setTabs(tabs.map(t => ({ ...t, active: t.id === id })))
    setSelectedId(id)
  }

  const handleTabClose = (id: string) => {
    const newTabs = tabs.filter(t => t.id !== id)
    if (newTabs.length > 0 && !newTabs.some(t => t.active)) {
      newTabs[0].active = true
    }
    setTabs(newTabs)
  }

  const openFile = (node: FileNode) => {
    if (node.type === 'folder') return
    if (!tabs.find(t => t.id === node.id)) {
      setTabs([...tabs.map(t => ({ ...t, active: false })), { 
        id: node.id, 
        name: node.name, 
        icon: node.name.endsWith('.tsx') ? <FileCode className="h-4 w-4" /> : <FileText className="h-4 w-4" />, 
        active: true 
      }])
    } else {
      handleTabClick(node.id)
    }
  }

  const createFile = (name: string, content: string = '', parentId?: string) => {
    const newNodeId = `${name}-${Date.now()}`
    const newNode: FileNode = { id: newNodeId, name, type: 'file', content }
    
    if (parentId) {
      const addToParent = (nodes: FileNode[]): FileNode[] => {
        return nodes.map(node => {
          if (node.id === parentId && node.type === 'folder') return { ...node, children: [...(node.children || []), newNode], isOpen: true }
          if (node.children) return { ...node, children: addToParent(node.children) }
          return node
        })
      }
      setFiles(addToParent(files))
    } else {
      setFiles([...files, newNode])
    }
    openFile(newNode)
  }

  const createFolder = (name: string, parentId?: string) => {
    const newNodeId = `${name}-${Date.now()}`
    const newNode: FileNode = { id: newNodeId, name, type: 'folder', children: [], isOpen: true }
    
    if (parentId) {
      const addToParent = (nodes: FileNode[]): FileNode[] => {
        return nodes.map(node => {
          if (node.id === parentId && node.type === 'folder') return { ...node, children: [...(node.children || []), newNode], isOpen: true }
          if (node.children) return { ...node, children: addToParent(node.children) }
          return node
        })
      }
      setFiles(addToParent(files))
    } else {
      setFiles([...files, newNode])
    }
  }

  const handleDelete = (id: string) => {
    const removeFromTree = (nodes: FileNode[]): FileNode[] => {
      return nodes
        .filter(node => node.id !== id)
        .map(node => ({
          ...node,
          children: node.children ? removeFromTree(node.children) : undefined
        }))
    }
    setFiles(removeFromTree(files))
    handleTabClose(id)
    toast({ title: "Resource Terminated", description: "Memory segments cleared successfully.", variant: "destructive" })
  }

  const handleSaveToSystem = () => {
    if (!activeFile) return
    const blob = new Blob([activeFile.content || ''], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = activeFile.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast({ title: "Local Save Successful", description: `File ${activeFile.name} mirrored to local storage.` })
  }

  const handleInstallLanguage = (id: string) => {
    toast({ title: "Fetching Runtime", description: `Synchronizing SDK for ${id.toUpperCase()}...` })
    setTimeout(() => {
      setInstalledLanguages(prev => [...prev, id])
      toast({ title: "Runtime Active", description: `${id.toUpperCase()} SDK is now online.` })
    }, 2500)
  }

  const handleFileAction = (action: string) => {
    switch(action) {
      case 'new-file':
        setCreateType('file')
        setIsCreateModalOpen(true)
        break
      case 'new-folder':
        setCreateType('folder')
        setIsCreateModalOpen(true)
        break
      case 'new-project':
        setIsWizardOpen(true)
        break
      case 'save-as':
        handleSaveToSystem()
        break
      case 'start-debug':
      case 'run-without-debug':
        setIsPreviewOpen(true)
        toast({ title: "Quantum Compilation", description: "Spinning up sandbox environment...", duration: 2000 })
        break
      case 'save':
        toast({ title: "Cloud Sync Complete", description: "Delta changes uploaded to neural nodes." })
        break
      case 'ai-assistant':
        setIsAiPanelOpen(!isAiPanelOpen)
        break
      case 'delete':
        if (selectedId) handleDelete(selectedId)
        break
      default:
        console.log("Action not implemented", action)
    }
  }

  const confirmCreate = () => {
    if (!newItemName) return
    if (createType === 'file') {
      createFile(newItemName, '', selectedId || undefined)
    } else {
      createFolder(newItemName, selectedId || undefined)
    }
    setNewItemName('')
    setIsCreateModalOpen(false)
  }

  const handleWizardComplete = (template: any) => {
    toast({ title: "Project Initialized", description: `Creating ${template.name} workspace...` })
    setFiles([...files, {
      id: `proj-${Date.now()}`,
      name: template.name.toLowerCase().replace(' ', '-'),
      type: 'folder',
      isOpen: true,
      children: [
        { id: `README-${Date.now()}`, name: 'README.md', type: 'file', content: `# ${template.name}\n\nGenerated by NEO CODE Wizard.` },
        { id: `main-${Date.now()}`, name: 'main.js', type: 'file', content: '// Start coding here...' }
      ]
    }])
    setIsWizardOpen(false)
  }

  // Resizing Logic
  const startDragging = useCallback((e: React.MouseEvent) => {
    setIsDraggingTerminal(true)
    e.preventDefault()
  }, [])

  const stopDragging = useCallback(() => {
    setIsDraggingTerminal(false)
  }, [])

  const onDrag = useCallback((e: MouseEvent) => {
    if (!isDraggingTerminal) return
    const newHeight = window.innerHeight - e.clientY
    if (newHeight > 100 && newHeight < window.innerHeight - 200) {
      setTerminalHeight(newHeight)
    }
  }, [isDraggingTerminal])

  useEffect(() => {
    if (isDraggingTerminal) {
      window.addEventListener('mousemove', onDrag)
      window.addEventListener('mouseup', stopDragging)
    } else {
      window.removeEventListener('mousemove', onDrag)
      window.removeEventListener('mouseup', stopDragging)
    }
    return () => {
      window.removeEventListener('mousemove', onDrag)
      window.removeEventListener('mouseup', stopDragging)
    }
  }, [isDraggingTerminal, onDrag, stopDragging])

  const renderSidebarView = () => {
    switch(activeSidebarTab) {
      case 'explorer':
        return <ProjectExplorer 
          searchQuery={searchQuery} 
          files={files} 
          setFiles={setFiles} 
          selectedId={selectedId} 
          onSelect={(id) => {
            setSelectedId(id)
            const findAndOpen = (nodes: FileNode[]) => {
              nodes.forEach(n => {
                if (n.id === id && n.type === 'file') openFile(n)
                if (n.children) findAndOpen(n.children)
              })
            }
            findAndOpen(files)
          }} 
          onDelete={handleDelete}
        />
      case 'search':
        return <SearchSidebar searchQuery={searchQuery} onSearch={setSearchQuery} />
      case 'git':
        return <GitSidebar />
      case 'run':
        return <DebugSidebar />
      case 'security':
        return <SecuritySidebar />
      case 'database':
        return <DatabaseSidebar />
      case 'extensions':
        return <ExtensionsSidebar installed={installedLanguages} onInstall={handleInstallLanguage} />
      default:
        return null
    }
  }

  const renderMainContent = () => {
    switch(activeSidebarTab) {
      case 'neocad': return <NeoCADPanel />
      case 'analytics': return <AnalyticsPanel />
      case 'quantum': return <QuantumReadyPanel />
      default:
        return (
          <div className="flex-1 flex flex-col overflow-hidden">
            <EditorTabs tabs={tabs} onTabClick={handleTabClick} onTabClose={handleTabClose} />
            <CodeEditor 
              code={activeFile?.content || ''} 
              fileName={activeFile?.name || 'app.tsx'} 
              onChange={handleUpdateCode} 
            />
          </div>
        )
    }
  }

  const detectedLanguage = useMemo(() => {
    if (!activeFile) return 'Plain Text'
    const lang = getLanguageFromFileName(activeFile.name)
    return lang.charAt(0).toUpperCase() + lang.slice(1)
  }, [activeFile])

  return (
    <main className="h-screen w-screen flex flex-col overflow-hidden bg-background text-foreground selection:bg-primary/30">
      <TopNav onSearch={setSearchQuery} onAction={handleFileAction} />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeId={activeSidebarTab} onActiveChange={setActiveSidebarTab} />
        
        {renderSidebarView()}
        
        <div className="flex-1 flex flex-col relative overflow-hidden border-l border-border/50">
          <div className="flex-1 flex overflow-hidden">
            {renderMainContent()}
            
            <div className={`transition-all duration-300 border-l border-border/50 bg-sidebar/30 ${isAiPanelOpen ? 'w-[380px]' : 'w-0 overflow-hidden'}`}>
               <AIAssistant 
                currentFile={activeFile?.id}
                currentCode={activeFile?.content}
                fileList={files.map(f => f.name)}
                onAction={(action) => {
                   if (action.type === 'createFile' && action.path) createFile(action.path, action.content)
                   if (action.type === 'createFolder' && action.path) createFolder(action.path)
                   if (action.type === 'updateCode' && action.content) handleUpdateCode(action.content)
                }}
                isEmbedded
              />
            </div>
          </div>
          
          <div 
            onMouseDown={startDragging}
            className="h-1 bg-border/20 hover:bg-primary/50 cursor-row-resize transition-colors z-50 relative group"
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
               <div className="w-12 h-1 bg-primary rounded-full" />
            </div>
          </div>
          <TerminalView activeFile={activeFile?.name} height={terminalHeight} />
        </div>
      </div>

      <ProjectWizard open={isWizardOpen} onOpenChange={setIsWizardOpen} onComplete={handleWizardComplete} />

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="glass-panel border-primary/20 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-primary font-bold uppercase tracking-widest text-xs flex items-center gap-2">
              {createType === 'file' ? <Code2 className="h-4 w-4" /> : <Layers className="h-4 w-4" />}
              Initialize New {createType}
            </DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <Input 
              autoFocus
              placeholder={`Enter ${createType} descriptor...`}
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && confirmCreate()}
              className="bg-black/40 border-white/10 font-code"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)} className="text-[10px] uppercase font-bold">ABORT</Button>
            <Button onClick={confirmCreate} className="bg-primary text-black font-bold text-[10px] uppercase">EXECUTE</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isPreviewOpen && (
        <div className="fixed inset-4 z-[100] glass-panel rounded-2xl border-primary/40 shadow-[0_0_100px_rgba(0,191,255,0.2)] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="h-12 bg-black/60 border-b border-white/10 flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5 mr-4">
                <div className="h-3 w-3 rounded-full bg-red-500/50" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                <div className="h-3 w-3 rounded-full bg-green-500/50" />
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1 text-[10px] text-muted-foreground w-[400px]">
                <Globe className="h-3 w-3" />
                <span className="truncate">https://neocode-quantum-preview.local:3000</span>
                <RefreshCw className="h-3 w-3 ml-auto hover:text-primary cursor-pointer" />
              </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 text-[10px] text-primary font-bold animate-pulse">
                 <Shield className="h-3 w-3" /> SECURE LINK ACTIVE
               </div>
               <Button variant="ghost" size="icon" onClick={() => setIsPreviewOpen(false)} className="h-8 w-8 hover:text-red-500">
                 <X className="h-4 w-4" />
               </Button>
            </div>
          </div>
          <div className="flex-1 bg-slate-900 flex items-center justify-center p-12 overflow-auto relative">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,191,255,0.05)_0%,transparent_70%)]" />
             <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl min-h-[500px] p-12 flex flex-col items-center justify-center text-center relative z-10">
                <div className="h-24 w-24 bg-primary/20 rounded-full flex items-center justify-center mb-8 border border-primary/30">
                  <Play className="h-12 w-12 text-primary fill-primary" />
                </div>
                <h2 className="text-4xl font-bold text-slate-800 mb-4 font-headline">NEO CODE Sandbox</h2>
                <p className="text-slate-500 max-w-md mb-8">
                  Virtual environment running `{activeFile?.name || 'app.tsx'}`. 
                  All neural computations are being hot-reloaded in real-time.
                </p>
                <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
                   <div className="p-8 border border-slate-100 rounded-2xl text-left bg-slate-50 hover:border-primary/20 transition-all cursor-pointer">
                      <p className="text-[10px] font-bold text-primary uppercase mb-2 tracking-widest">Active Route</p>
                      <p className="text-lg font-code text-slate-700 font-bold">/{activeFile?.name || 'index.html'}</p>
                   </div>
                   <div className="p-8 border border-slate-100 rounded-2xl text-left bg-slate-50 hover:border-primary/20 transition-all cursor-pointer">
                      <p className="text-[10px] font-bold text-accent uppercase mb-2 tracking-widest">Server Status</p>
                      <p className="text-lg font-code text-slate-700 font-bold">200 OK - 2ms Latency</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      <footer className="h-7 bg-primary text-primary-foreground flex items-center px-4 justify-between text-[10px] font-bold tracking-wider uppercase select-none z-50">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5">
             <div className="h-2 w-2 rounded-full bg-primary-foreground animate-pulse" />
             SYSTEM: OPTIMIZED
          </div>
          <div className="flex items-center gap-1.5 opacity-80">
            <Layers className="h-3 w-3" /> MAIN BRANCH
          </div>
          <span className="opacity-60">UTF-8</span>
          <span className="opacity-60">L1, C1</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-black/10 px-3 py-0.5 rounded-sm">
             <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
             NEURAL-LINK: ACTIVE
          </div>
          <div className="flex items-center gap-2 bg-black/10 px-3 py-0.5 rounded-sm">
             <Code2 className="h-3 w-3" />
             MODEL: {activeModel}
          </div>
          <span className="flex items-center gap-1.5">
            <FileCode className="h-3.5 w-3.5" /> {detectedLanguage}
          </span>
          <div className="flex items-center gap-1 text-[9px]">
            LINK: <span className="text-green-900">ENCRYPTED</span>
          </div>
        </div>
      </footer>
      <Toaster />
    </main>
  )
}
