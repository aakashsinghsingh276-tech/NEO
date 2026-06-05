"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { Sidebar } from "@/components/ide/Sidebar"
import { TopNav } from "@/components/ide/TopNav"
import { ProjectExplorer } from "@/components/ide/ProjectExplorer"
import { SearchSidebar, GitSidebar, DebugSidebar, SecuritySidebar } from "@/components/ide/SidebarViews"
import { EditorTabs } from "@/components/ide/EditorTabs"
import { CodeEditor } from "@/components/ide/CodeEditor"
import { TerminalView } from "@/components/ide/TerminalView"
import { AIAssistant } from "@/components/ide/AIAssistant"
import { FileCode, FileText, Globe, X, Play, Shield, RefreshCw } from "lucide-react"
import { NeoCADPanel, AnalyticsPanel, QuantumReadyPanel } from "@/components/ide/FeaturePanels"
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
      { id: 'app.tsx', name: 'app.tsx', type: 'file', content: 'import React from "react";\n\nexport default function App() {\n  return (\n    <div className="p-8 bg-slate-900 text-white min-h-screen flex items-center justify-center">\n      <h1 className="text-4xl font-bold text-blue-400">Hello NEO CODE!</h1>\n    </div>\n  );\n}' },
      { id: 'styles.css', name: 'styles.css', type: 'file', content: 'body {\n  background: #0D1117;\n  color: #00BFFF;\n  font-family: "Space Grotesk", sans-serif;\n}' }
    ]
  },
  { id: 'README.md', name: 'README.md', type: 'file', content: '# NEO CODE Project\n\nQuantum-ready workspace powered by GenAI.\n\n## Get Started\n1. Open `src/app.tsx`\n2. Click "Run" in the top menu\n3. Ask AI for help!' }
]

export default function IDEPage() {
  const [activeSidebarTab, setActiveSidebarTab] = useState('explorer')
  const [files, setFiles] = useState<FileNode[]>(initialFiles)
  const [tabs, setTabs] = useState<{id: string, name: string, icon: any, active: boolean}[]>([
    { id: 'app.tsx', name: 'app.tsx', icon: <FileCode className="h-4 w-4" />, active: true }
  ])
  const [selectedId, setSelectedId] = useState<string | null>('app.tsx')
  const [searchQuery, setSearchQuery] = useState('')
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  
  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
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
    const newNodeId = name + '-' + Date.now()
    const newNode: FileNode = { id: newNodeId, name, type: 'file', content }
    
    if (parentId) {
      const addToParent = (nodes: FileNode[]): FileNode[] => {
        return nodes.map(node => {
          if (node.id === parentId) return { ...node, children: [...(node.children || []), newNode], isOpen: true }
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
    const newNodeId = name + '-' + Date.now()
    const newNode: FileNode = { id: newNodeId, name, type: 'folder', children: [], isOpen: true }
    
    if (parentId) {
      const addToParent = (nodes: FileNode[]): FileNode[] => {
        return nodes.map(node => {
          if (node.id === parentId) return { ...node, children: [...(node.children || []), newNode], isOpen: true }
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
    toast({ title: "Deleted", description: "Resource removed from neural-link.", variant: "destructive" })
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
    toast({ title: "Saved to Computer", description: `${activeFile.name} downloaded successfully.` })
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
      case 'save-as':
        handleSaveToSystem()
        break
      case 'start-debug':
      case 'run-without-debug':
        setIsPreviewOpen(true)
        toast({ title: "Launching App", description: "Compiling and serving project...", duration: 2000 })
        break
      case 'save':
        toast({ title: "Project Saved", description: "All changes committed to neural cache." })
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

  return (
    <main className="h-screen w-screen flex flex-col overflow-hidden bg-background text-foreground">
      <TopNav onSearch={setSearchQuery} onAction={handleFileAction} />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeId={activeSidebarTab} onActiveChange={setActiveSidebarTab} />
        
        {renderSidebarView()}
        
        <div className="flex-1 flex flex-col relative overflow-hidden border-l border-border/50">
          <div className="flex-1 flex overflow-hidden">
            {renderMainContent()}
            
            {/* Professional AI Panel (Collapsible) */}
            <div className={`transition-all duration-300 border-l border-border/50 ${isAiPanelOpen ? 'w-[400px]' : 'w-0 overflow-hidden'}`}>
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
          
          <TerminalView />
        </div>
      </div>

      {/* Creation Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="glass-panel border-primary/20 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-primary font-bold uppercase tracking-widest text-sm">
              New {createType === 'file' ? 'File' : 'Folder'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input 
              autoFocus
              placeholder={`Enter ${createType} name...`}
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && confirmCreate()}
              className="bg-black/40 border-white/10"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>CANCEL</Button>
            <Button onClick={confirmCreate} className="bg-primary text-black font-bold">CREATE</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Real App Preview Overlay */}
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
          <div className="flex-1 bg-slate-900 flex items-center justify-center p-12 overflow-auto">
             <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl min-h-[500px] p-12 flex flex-col items-center justify-center text-center">
                <div className="h-20 w-20 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                  <Play className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-4">NEO CODE Live Preview</h2>
                <p className="text-slate-500 max-w-md mb-8">
                  Your application is running in the quantum sandbox. All changes in `src/app.tsx` are hot-reloaded instantly.
                </p>
                <div className="grid grid-cols-2 gap-4 w-full">
                   <div className="p-6 border border-slate-100 rounded-xl text-left bg-slate-50">
                      <p className="text-[10px] font-bold text-primary uppercase mb-1">Active Route</p>
                      <p className="text-sm font-code text-slate-700 font-bold">/index.html</p>
                   </div>
                   <div className="p-6 border border-slate-100 rounded-xl text-left bg-slate-50">
                      <p className="text-[10px] font-bold text-accent uppercase mb-1">Server Status</p>
                      <p className="text-sm font-code text-slate-700 font-bold">200 OK - 0ms Latency</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      <AIAssistant 
        currentFile={activeFile?.id}
        currentCode={activeFile?.content}
        fileList={files.map(f => f.name)}
        onAction={(action) => {
           if (action.type === 'createFile' && action.path) createFile(action.path, action.content)
           if (action.type === 'createFolder' && action.path) createFolder(action.path)
           if (action.type === 'updateCode' && action.content) handleUpdateCode(action.content)
        }}
      />

      <footer className="h-6 bg-primary text-primary-foreground flex items-center px-4 justify-between text-[10px] font-bold tracking-wider uppercase select-none z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
             <div className="h-2 w-2 rounded-full bg-primary-foreground animate-pulse" />
             QUANTUM-READY
          </div>
          <span>UTF-8</span>
          <span>Line 1, Col 1</span>
        </div>
        <div className="flex items-center gap-4">
          <span>POLYGLOT ENGINE: STABLE</span>
          <span className="opacity-70">NEURAL-LINK ACTIVE</span>
          <span className="flex items-center gap-1">
            <FileCode className="h-3 w-3" /> TypeScript React
          </span>
        </div>
      </footer>
      <Toaster />
    </main>
  )
}
