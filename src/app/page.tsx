
"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { Sidebar } from "@/components/ide/Sidebar"
import { TopNav } from "@/components/ide/TopNav"
import { ProjectExplorer } from "@/components/ide/ProjectExplorer"
import { SearchSidebar, GitSidebar, DebugSidebar, SecuritySidebar, ExtensionsSidebar, DatabaseSidebar } from "@/components/ide/SidebarViews"
import { EditorTabs } from "@/components/ide/EditorTabs"
import { CodeEditor } from "@/components/ide/CodeEditor"
import { TerminalView } from "@/components/ide/TerminalView"
import { AIAssistant } from "@/components/ide/AIAssistant"
import { FileCode, FileText, Globe, RefreshCw, Layers, Code2, Download, LogIn, Github, Info } from "lucide-react"
import { NeoCADPanel, AnalyticsPanel, QuantumReadyPanel, ProjectWizard } from "@/components/ide/FeaturePanels"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useFirestore, useCollection, useUser, useAuth } from "@/firebase"
import { collection, doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore"
import { useMemoFirebase } from "@/firebase/firestore/use-memo-firebase"
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError } from "@/firebase/errors"

export interface FileNode {
  id: string
  name: string
  type: 'file' | 'folder'
  children?: FileNode[]
  isOpen?: boolean
  content?: string
  parentId?: string | null
}

export default function IDEPage() {
  const db = useFirestore();
  const auth = useAuth();
  const { user, loading: authLoading } = useUser();
  const { toast } = useToast()
  
  const [activeSidebarTab, setActiveSidebarTab] = useState('explorer')
  const [tabs, setTabs] = useState<{id: string, name: string, icon: any, active: boolean}[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(true)
  const [terminalHeight, setTerminalHeight] = useState(300)
  const [isDraggingTerminal, setIsDraggingTerminal] = useState(false)
  const [aiSidebarWidth, setAiSidebarWidth] = useState(380)
  const [isDraggingAiSidebar, setIsDraggingAiSidebar] = useState(false)
  
  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [createType, setCreateType] = useState<'file' | 'folder'>('file')
  const [newItemName, setNewItemName] = useState('')

  // Determine current workspace ID (User UID or 'guest')
  const workspaceId = user?.uid || 'guest-workspace';

  // Real-time Files from Firestore
  const filesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, "users", workspaceId, "files");
  }, [db, workspaceId]);
  
  const { data: remoteFiles, loading: filesLoading } = useCollection<any>(filesQuery);

  // Construct Tree from Flat List
  const files = useMemo(() => {
    if (!remoteFiles || remoteFiles.length === 0) return [];
    const tree: FileNode[] = [];
    const map: Record<string, FileNode> = {};
    remoteFiles.forEach(f => {
      map[f.id] = { ...f, children: f.type === 'folder' ? [] : undefined };
    });
    remoteFiles.forEach(f => {
      if (f.parentId && map[f.parentId]) {
        map[f.parentId].children?.push(map[f.id]);
      } else {
        tree.push(map[f.id]);
      }
    });
    return tree;
  }, [remoteFiles]);

  const activeFile = useMemo(() => {
    if (!remoteFiles || !selectedId) return null;
    return remoteFiles.find(f => f.id === selectedId) || null;
  }, [remoteFiles, selectedId]);

  const handleUpdateCode = (newCode: string) => {
    if (!db || !selectedId) return;
    const docRef = doc(db, "users", workspaceId, "files", selectedId);
    setDoc(docRef, { content: newCode }, { merge: true })
      .catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: { content: newCode }
        }));
      });
  }

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: "Neural Link Established", description: "Successfully authenticated with Quantum Cloud." });
    } catch (err: any) {
      console.error("Auth Error:", err);
      toast({ 
        variant: "destructive", 
        title: "Authentication Failed", 
        description: "Could not sync with Google services." 
      });
    }
  }

  const handleLogout = async () => {
    await signOut(auth);
    setTabs([]);
    setSelectedId(null);
    toast({ title: "System Offline", description: "Workspace disconnected safely." });
  }

  const handleTabClick = (id: string) => {
    setTabs(tabs.map(t => ({ ...t, active: t.id === id })))
    setSelectedId(id)
  }

  const handleTabClose = (id: string) => {
    const newTabs = tabs.filter(t => t.id !== id)
    if (newTabs.length > 0 && !newTabs.some(t => t.active)) {
      newTabs[0].active = true
      setSelectedId(newTabs[0].id)
    } else if (newTabs.length === 0) {
      setSelectedId(null)
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
      setSelectedId(node.id)
    } else {
      handleTabClick(node.id)
    }
  }

  const createFile = (name: string, content: string = '', parentId?: string) => {
    if (!db) return;
    const fileId = `${name.replace(/\s+/g, '-')}-${Date.now()}`;
    const docRef = doc(db, "users", workspaceId, "files", fileId);
    setDoc(docRef, {
      id: fileId,
      name,
      type: 'file',
      content,
      parentId: parentId || null,
      updatedAt: serverTimestamp()
    }).catch(async () => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: docRef.path,
        operation: 'create',
        requestResourceData: { name, type: 'file' }
      }));
    });
    toast({ title: "Module Initialized", description: `File ${name} added.` });
  }

  const createFolder = (name: string, parentId?: string) => {
    if (!db) return;
    const folderId = `${name.replace(/\s+/g, '-')}-${Date.now()}`;
    const docRef = doc(db, "users", workspaceId, "files", folderId);
    setDoc(docRef, {
      id: folderId,
      name,
      type: 'folder',
      parentId: parentId || null,
      updatedAt: serverTimestamp()
    }).catch(async () => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: docRef.path,
        operation: 'create',
        requestResourceData: { name, type: 'folder' }
      }));
    });
    toast({ title: "Sector Created", description: `Folder ${name} created.` });
  }

  const handleDelete = (id: string) => {
    if (!db) return;
    const docRef = doc(db, "users", workspaceId, "files", id);
    deleteDoc(docRef).catch(async () => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: docRef.path,
        operation: 'delete'
      }));
    });
    handleTabClose(id);
    toast({ title: "Resource Terminated", description: "Resource deleted.", variant: "destructive" });
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
      case 'save':
        toast({ title: "Cloud Sync Complete", description: "Workspace saved." })
        break
      case 'ai-assistant':
        setIsAiPanelOpen(!isAiPanelOpen)
        break
      case 'delete':
        if (selectedId) handleDelete(selectedId)
        break
      case 'install-all-languages':
        toast({ title: "Polyglot Engine Sync", description: "Synchronizing all 50+ language runtimes..." })
        break
      default:
        console.log("Action not implemented", action)
    }
  }

  const confirmCreate = () => {
    if (!newItemName) return
    const parentNode = remoteFiles?.find(f => f.id === selectedId);
    let parentId = null;
    if (parentNode) {
      parentId = parentNode.type === 'folder' ? parentNode.id : parentNode.parentId;
    }
    
    if (createType === 'file') {
      createFile(newItemName, '', parentId)
    } else {
      createFolder(newItemName, parentId)
    }
    setNewItemName('')
    setIsCreateModalOpen(false)
  }

  // Resizing Logic for Terminal
  const startDraggingTerminal = useCallback((e: React.MouseEvent) => {
    setIsDraggingTerminal(true)
    e.preventDefault()
  }, [])

  const stopDraggingTerminal = useCallback(() => {
    setIsDraggingTerminal(false)
  }, [])

  const onDragTerminal = useCallback((e: MouseEvent) => {
    if (!isDraggingTerminal) return
    const newHeight = window.innerHeight - e.clientY
    if (newHeight > 100 && newHeight < window.innerHeight - 200) {
      setTerminalHeight(newHeight)
    }
  }, [isDraggingTerminal])

  // Resizing Logic for AI Sidebar
  const startDraggingAiSidebar = useCallback((e: React.MouseEvent) => {
    setIsDraggingAiSidebar(true)
    e.preventDefault()
  }, [])

  const stopDraggingAiSidebar = useCallback(() => {
    setIsDraggingAiSidebar(false)
  }, [])

  const onDragAiSidebar = useCallback((e: MouseEvent) => {
    if (!isDraggingAiSidebar) return
    const newWidth = window.innerWidth - e.clientX
    if (newWidth > 250 && newWidth < 800) {
      setAiSidebarWidth(newWidth)
    }
  }, [isDraggingAiSidebar])

  useEffect(() => {
    if (isDraggingTerminal) {
      window.addEventListener('mousemove', onDragTerminal)
      window.addEventListener('mouseup', stopDraggingTerminal)
    } else {
      window.removeEventListener('mousemove', onDragTerminal)
      window.removeEventListener('mouseup', stopDraggingTerminal)
    }
    return () => {
      window.removeEventListener('mousemove', onDragTerminal)
      window.removeEventListener('mouseup', stopDraggingTerminal)
    }
  }, [isDraggingTerminal, onDragTerminal, stopDraggingTerminal])

  useEffect(() => {
    if (isDraggingAiSidebar) {
      window.addEventListener('mousemove', onDragAiSidebar)
      window.addEventListener('mouseup', stopDraggingAiSidebar)
    } else {
      window.removeEventListener('mousemove', onDragAiSidebar)
      window.removeEventListener('mouseup', stopDraggingAiSidebar)
    }
    return () => {
      window.removeEventListener('mousemove', onDragAiSidebar)
      window.removeEventListener('mouseup', stopDraggingAiSidebar)
    }
  }, [isDraggingAiSidebar, onDragAiSidebar, stopDraggingAiSidebar])

  if (authLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background text-primary gap-4">
        <RefreshCw className="h-12 w-12 animate-spin" />
        <p className="text-[10px] font-bold tracking-[0.4em] uppercase animate-pulse">Synchronizing Neural Workspace...</p>
      </div>
    )
  }

  return (
    <main className="h-screen w-screen flex flex-col overflow-hidden bg-background text-foreground selection:bg-primary/30">
      <TopNav onSearch={setSearchQuery} onAction={handleFileAction} user={user} onLogout={handleLogout} />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeId={activeSidebarTab} onActiveChange={setActiveSidebarTab} />
        {activeSidebarTab === 'explorer' ? (
          <ProjectExplorer 
            searchQuery={searchQuery} 
            files={files} 
            setFiles={() => {}} 
            selectedId={selectedId} 
            onSelect={(id) => {
              setSelectedId(id)
              const node = remoteFiles?.find(f => f.id === id);
              if (node && node.type === 'file') openFile(node)
            }} 
            onDelete={handleDelete}
            onCreate={(type) => handleFileAction(type === 'file' ? 'new-file' : 'new-folder')}
          />
        ) : activeSidebarTab === 'search' ? (
          <SearchSidebar searchQuery={searchQuery} onSearch={setSearchQuery} />
        ) : activeSidebarTab === 'git' ? (
          <GitSidebar />
        ) : activeSidebarTab === 'run' ? (
          <DebugSidebar />
        ) : activeSidebarTab === 'security' ? (
          <SecuritySidebar />
        ) : activeSidebarTab === 'database' ? (
          <DatabaseSidebar />
        ) : activeSidebarTab === 'extensions' ? (
          <ExtensionsSidebar installed={['js', 'ts', 'py']} onInstall={() => {}} />
        ) : null}
        
        <div className="flex-1 flex flex-col relative overflow-hidden border-l border-border/50">
          <div className="flex-1 flex overflow-hidden">
            {activeSidebarTab === 'neocad' ? <NeoCADPanel /> :
             activeSidebarTab === 'analytics' ? <AnalyticsPanel /> :
             activeSidebarTab === 'quantum' ? <QuantumReadyPanel /> :
             <div className="flex-1 flex flex-col overflow-hidden">
               <EditorTabs tabs={tabs} onTabClick={handleTabClick} onTabClose={handleTabClose} />
               <CodeEditor code={activeFile?.content || ''} fileName={activeFile?.name || 'app.tsx'} onChange={handleUpdateCode} />
             </div>}
            
            <div 
              style={{ width: isAiPanelOpen ? `${aiSidebarWidth}px` : '0px' }}
              className="transition-all duration-300 border-l border-border/50 bg-sidebar/30 relative overflow-hidden shrink-0"
            >
               {isAiPanelOpen && (
                 <div 
                   onMouseDown={startDraggingAiSidebar}
                   className="absolute left-0 top-0 bottom-0 w-1 bg-border/20 hover:bg-primary/50 cursor-col-resize transition-colors z-50 group"
                 />
               )}
               <AIAssistant 
                currentFile={activeFile?.id}
                currentCode={activeFile?.content}
                fileList={remoteFiles?.map(f => f.name) || []}
                onAction={(action) => {
                   if (action.type === 'createFile' && action.path) createFile(action.path, action.content)
                   if (action.type === 'createFolder' && action.path) createFolder(action.path)
                   if (action.type === 'updateCode' && action.content) handleUpdateCode(action.content)
                }}
                isEmbedded
              />
            </div>
          </div>
          
          <div onMouseDown={startDraggingTerminal} className="h-1 bg-border/20 hover:bg-primary/50 cursor-row-resize transition-colors z-50 relative group" />
          <TerminalView activeFile={activeFile?.name} height={terminalHeight} />
        </div>
      </div>

      <ProjectWizard open={isWizardOpen} onOpenChange={setIsWizardOpen} onComplete={(t) => createFolder(t.name.toLowerCase().replace(' ', '-'))} />
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="glass-panel border-primary/20 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-primary font-bold uppercase tracking-widest text-xs flex items-center gap-2">
              {createType === 'file' ? <Code2 className="h-4 w-4" /> : <Layers className="h-4 w-4" />}
              Initialize New {createType}
            </DialogTitle>
          </DialogHeader>
          <div className="py-6"><Input autoFocus placeholder={`Enter ${createType} descriptor...`} value={newItemName} onChange={(e) => setNewItemName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && confirmCreate()} className="bg-black/40 border-white/10 font-code" /></div>
          <DialogFooter><Button variant="ghost" onClick={() => setIsCreateModalOpen(false)} className="text-[10px] uppercase font-bold">ABORT</Button><Button onClick={confirmCreate} className="bg-primary text-black font-bold text-[10px] uppercase">EXECUTE</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      
      <footer className="h-7 bg-primary text-primary-foreground flex items-center px-4 justify-between text-[10px] font-bold tracking-wider uppercase select-none z-50">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-primary-foreground animate-pulse" /> SYSTEM: OPTIMIZED</div>
          <div className="flex items-center gap-1.5 opacity-80"><Globe className="h-3 w-3" /> WORKSPACE: {user?.displayName || user?.email || 'GUEST-SESSION'}</div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-black/10 px-3 py-0.5 rounded-sm"><div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> NEURAL-LINK: ACTIVE</div>
          <div className="flex items-center gap-2 bg-black/10 px-3 py-0.5 rounded-sm"><Code2 className="h-3 w-3" /> MODEL: DeepSeek-V3</div>
        </div>
      </footer>
      <Toaster />
    </main>
  )
}
