
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
import { FileCode, FileText, Globe, X, Play, Shield, RefreshCw, Layers, Database, Code2, Download, LogIn, Github, Info } from "lucide-react"
import { NeoCADPanel, AnalyticsPanel, QuantumReadyPanel, ProjectWizard } from "@/components/ide/FeaturePanels"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useFirestore, useCollection, useUser, useAuth } from "@/firebase"
import { collection, doc, setDoc, deleteDoc, query, where, serverTimestamp } from "firebase/firestore"
import { useMemoFirebase } from "@/firebase/firestore/use-memo-firebase"
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError } from "@/firebase/errors"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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
  
  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [createType, setCreateType] = useState<'file' | 'folder'>('file')
  const [newItemName, setNewItemName] = useState('')

  // Real-time Files from Firestore - scoped to USER
  const filesQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, "users", user.uid, "files");
  }, [db, user]);
  
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
    if (!db || !selectedId || !user) return;
    const docRef = doc(db, "users", user.uid, "files", selectedId);
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
      let errorMessage = "Could not sync with Google services.";
      
      if (err.code === 'auth/invalid-action-code') {
        errorMessage = "Invalid action. Please ensure Google Sign-In is enabled in Firebase Console and this domain is authorized.";
      } else if (err.code === 'auth/unauthorized-domain') {
        errorMessage = "Unauthorized domain. Add this URL to 'Authorized Domains' in Firebase Authentication settings.";
      }

      toast({ 
        variant: "destructive", 
        title: "Authentication Failed", 
        description: errorMessage 
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
    if (!db || !user) return;
    const fileId = `${name.replace(/\s+/g, '-')}-${Date.now()}`;
    const docRef = doc(db, "users", user.uid, "files", fileId);
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
    toast({ title: "Module Initialized", description: `File ${name} synced to Cloud.` });
  }

  const createFolder = (name: string, parentId?: string) => {
    if (!db || !user) return;
    const folderId = `${name.replace(/\s+/g, '-')}-${Date.now()}`;
    const docRef = doc(db, "users", user.uid, "files", folderId);
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
    toast({ title: "Sector Created", description: `Memory cluster ${name} allocated.` });
  }

  const handleDelete = (id: string) => {
    if (!db || !user) return;
    const docRef = doc(db, "users", user.uid, "files", id);
    deleteDoc(docRef).catch(async () => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: docRef.path,
        operation: 'delete'
      }));
    });
    handleTabClose(id);
    toast({ title: "Resource Terminated", description: "Cloud data cleared successfully.", variant: "destructive" });
  }

  const handleFileAction = (action: string) => {
    if (!user && action !== 'about') {
       handleLogin();
       return;
    }
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
        toast({ title: "Cloud Sync Complete", description: "Workspace saved to internal database." })
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

  if (authLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background text-primary gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-2xl animate-pulse rounded-full" />
          <RefreshCw className="h-12 w-12 animate-spin relative z-10" />
        </div>
        <p className="text-[10px] font-bold tracking-[0.4em] uppercase animate-pulse">Synchronizing Neural Workspace...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,191,255,0.05)_0%,transparent_70%)]" />
        <Card className="glass-panel p-12 w-full max-w-md text-center flex flex-col items-center gap-8 relative z-10 rounded-3xl border-primary/20 shadow-[0_0_100px_rgba(0,191,255,0.1)]">
           <div className="h-20 w-20 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/30 group hover:rotate-90 transition-all duration-500">
             <Code2 className="h-10 w-10 text-primary drop-shadow-[0_0_10px_#00BFFF]" />
           </div>
           <div>
             <h1 className="text-4xl font-headline font-bold text-foreground mb-3 tracking-tighter">NEO CODE</h1>
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-80">Quantum Intelligence IDE V1.0</p>
           </div>
           
           <Alert variant="default" className="bg-primary/5 border-primary/20 text-muted-foreground text-left">
             <Info className="h-4 w-4 text-primary" />
             <AlertTitle className="text-[10px] font-bold text-primary uppercase tracking-widest">Setup Required</AlertTitle>
             <AlertDescription className="text-[11px] leading-relaxed">
               Ensure <b>Google Sign-In</b> is enabled in Firebase Console and this domain is added to <b>Authorized Domains</b>.
             </AlertDescription>
           </Alert>

           <p className="text-sm text-muted-foreground leading-relaxed">
             Sign in to sync your professional workspace across spatial planes and access the Quantum AI Core.
           </p>
           <div className="flex flex-col gap-3 w-full">
             <Button onClick={handleLogin} className="w-full h-12 gap-3 bg-primary text-black font-bold uppercase text-xs tracking-widest shadow-[0_0_20px_rgba(0,191,255,0.3)] hover:scale-105 transition-all">
               <LogIn className="h-4 w-4" /> Start Neural Session
             </Button>
             <Button variant="outline" className="w-full h-12 gap-3 border-white/10 hover:bg-white/5 font-bold uppercase text-xs tracking-widest">
               <Github className="h-4 w-4" /> Open Source Access
             </Button>
           </div>
           <p className="text-[9px] text-muted-foreground uppercase tracking-tighter opacity-50">
             SECURE QUANTUM LINK | AES-4096 ENCRYPTED
           </p>
        </Card>
      </div>
    )
  }

  const renderSidebarView = () => {
    switch(activeSidebarTab) {
      case 'explorer':
        return <ProjectExplorer 
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
      case 'search': return <SearchSidebar searchQuery={searchQuery} onSearch={setSearchQuery} />
      case 'git': return <GitSidebar />
      case 'run': return <DebugSidebar />
      case 'security': return <SecuritySidebar />
      case 'database': return <DatabaseSidebar />
      case 'extensions': return <ExtensionsSidebar installed={['js', 'ts', 'py']} onInstall={() => {}} />
      default: return null
    }
  }

  return (
    <main className="h-screen w-screen flex flex-col overflow-hidden bg-background text-foreground selection:bg-primary/30">
      <TopNav onSearch={setSearchQuery} onAction={handleFileAction} user={user} onLogout={handleLogout} />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeId={activeSidebarTab} onActiveChange={setActiveSidebarTab} />
        {renderSidebarView()}
        
        <div className="flex-1 flex flex-col relative overflow-hidden border-l border-border/50">
          <div className="flex-1 flex overflow-hidden">
            {activeSidebarTab === 'neocad' ? <NeoCADPanel /> :
             activeSidebarTab === 'analytics' ? <AnalyticsPanel /> :
             activeSidebarTab === 'quantum' ? <QuantumReadyPanel /> :
             <div className="flex-1 flex flex-col overflow-hidden">
               <EditorTabs tabs={tabs} onTabClick={handleTabClick} onTabClose={handleTabClose} />
               <CodeEditor code={activeFile?.content || ''} fileName={activeFile?.name || 'app.tsx'} onChange={handleUpdateCode} />
             </div>}
            
            <div className={`transition-all duration-300 border-l border-border/50 bg-sidebar/30 ${isAiPanelOpen ? 'w-[380px]' : 'w-0 overflow-hidden'}`}>
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
          
          <div onMouseDown={startDragging} className="h-1 bg-border/20 hover:bg-primary/50 cursor-row-resize transition-colors z-50 relative group" />
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
          <div className="flex items-center gap-1.5 opacity-80"><Globe className="h-3 w-3" /> USER: {user.displayName || user.email}</div>
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
