
"use client"

import { useState, useCallback, useMemo } from "react"
import { Sidebar } from "@/components/ide/Sidebar"
import { TopNav } from "@/components/ide/TopNav"
import { ProjectExplorer } from "@/components/ide/ProjectExplorer"
import { SearchSidebar, GitSidebar, DebugSidebar, SecuritySidebar } from "@/components/ide/SidebarViews"
import { EditorTabs } from "@/components/ide/EditorTabs"
import { CodeEditor } from "@/components/ide/CodeEditor"
import { TerminalView } from "@/components/ide/TerminalView"
import { AIAssistant } from "@/components/ide/AIAssistant"
import { FileCode, FileText } from "lucide-react"
import { NeoCADPanel, AnalyticsPanel, QuantumReadyPanel } from "@/components/ide/FeaturePanels"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

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
      { id: 'app.tsx', name: 'app.tsx', type: 'file', content: 'import { QuantumCore } from "@neocode/core";\n\nconsole.log("NEO CODE INITIALIZED");\n\nexport const init = () => {\n  const engine = new QuantumCore();\n  engine.start();\n};' },
      { id: 'styles.css', name: 'styles.css', type: 'file', content: 'body {\n  background: #0D1117;\n  color: #00BFFF;\n  font-family: "Space Grotesk", sans-serif;\n}' }
    ]
  },
  { id: 'README.md', name: 'README.md', type: 'file', content: '# NEO CODE Project\n\nQuantum-ready workspace powered by GenAI.\n\n## Get Started\n1. Open `src/app.tsx`\n2. Click "Run" in the terminal\n3. Ask AI for help!' }
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

  const handleFileAction = (action: string) => {
    switch(action) {
      case 'new-file':
        const name = prompt("Enter file name:")
        if (name) createFile(name, '', selectedId || undefined)
        break
      case 'new-folder':
        const folderName = prompt("Enter folder name:")
        if (folderName) createFolder(folderName, selectedId || undefined)
        break
      case 'save':
        toast({ title: "Project Saved", description: "All changes committed to neural cache." })
        break
      case 'ai-assistant':
        setIsAiPanelOpen(!isAiPanelOpen)
        break
      default:
        console.log("Action not implemented", action)
    }
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
