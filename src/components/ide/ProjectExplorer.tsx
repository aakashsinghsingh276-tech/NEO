
"use client"

import { useState, useMemo } from "react"
import { ChevronDown, ChevronRight, File, Folder, FolderOpen, Trash2, Plus, FilePlus } from "lucide-react"
import { cn } from "@/lib/utils"
import { FileNode } from "@/app/page"

interface TreeNodeProps {
  node: FileNode
  depth?: number
  selectedId: string | null
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  openFolders: Set<string>
  onToggle: (id: string) => void
}

function TreeNode({ 
  node, 
  depth = 0, 
  selectedId, 
  onSelect, 
  onDelete,
  openFolders,
  onToggle
}: TreeNodeProps) {
  const isFolder = node.type === 'folder'
  const isSelected = selectedId === node.id
  const isOpen = openFolders.has(node.id)

  return (
    <div className="select-none">
      <div 
        onClick={(e) => {
          e.stopPropagation()
          onSelect(node.id)
          if (isFolder) onToggle(node.id)
        }}
        className={cn(
          "group flex items-center gap-1 py-1 px-2 cursor-pointer hover:bg-white/5 text-[11px] rounded-sm transition-all border-l-2",
          isSelected 
            ? "bg-primary/10 text-primary border-primary" 
            : "text-muted-foreground border-transparent hover:text-foreground"
        )}
        style={{ paddingLeft: `${(depth * 12) + 8}px` }}
      >
        <span className="shrink-0">
          {isFolder ? (
            isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />
          ) : <div className="w-3" />}
        </span>
        
        <span className="shrink-0">
          {isFolder ? (
            isOpen ? <FolderOpen className="h-3.5 w-3.5 text-primary/80" /> : <Folder  className="h-3.5 w-3.5 text-primary/80" />
          ) : <File className="h-3.5 w-3.5 text-muted-foreground" />}
        </span>
        
        <span className={cn("truncate flex-1", isFolder && "font-medium")}>{node.name}</span>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(node.id);
          }}
          className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-all"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
      
      {isFolder && isOpen && node.children && node.children.length > 0 && (
        <div className="flex flex-col">
          {node.children.map((child) => (
            <TreeNode 
              key={child.id} 
              node={child} 
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              onDelete={onDelete}
              openFolders={openFolders}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function ProjectExplorer({ searchQuery = '', files, selectedId, onSelect, onDelete, onCreate }: { 
  searchQuery?: string,
  files: FileNode[],
  setFiles: (f: FileNode[]) => void,
  selectedId: string | null,
  onSelect: (id: string) => void,
  onDelete: (id: string) => void,
  onCreate: (type: 'file' | 'folder') => void
}) {
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set())

  const handleToggleFolder = (id: string) => {
    setOpenFolders(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const filteredFiles = useMemo(() => {
    if (!searchQuery) return files
    
    const filterNodes = (nodes: FileNode[]): FileNode[] => {
      return nodes.reduce((acc: FileNode[], node) => {
        const matches = node.name.toLowerCase().includes(searchQuery.toLowerCase())
        let childrenMatches: FileNode[] = []
        if (node.children) childrenMatches = filterNodes(node.children)
        
        if (matches || childrenMatches.length > 0) {
          acc.push({ 
            ...node, 
            isOpen: true, 
            children: node.children ? childrenMatches : undefined 
          })
        }
        return acc
      }, [])
    }
    return filterNodes(files)
  }, [files, searchQuery])

  return (
    <div className="w-[240px] bg-sidebar/50 border-r border-border h-full flex flex-col">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Explorer</span>
        <div className="flex gap-2 text-muted-foreground">
          <button 
            onClick={() => onCreate('folder')} 
            className="hover:text-primary transition-colors p-1" 
            title="New Folder"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button 
            onClick={() => onCreate('file')} 
            className="hover:text-primary transition-colors p-1" 
            title="New File"
          >
            <FilePlus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="p-1 overflow-y-auto custom-scrollbar flex-1">
        {filteredFiles.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter italic">No resources found</p>
          </div>
        ) : (
          filteredFiles.map((node) => (
            <TreeNode 
              key={node.id} 
              node={node} 
              selectedId={selectedId}
              onSelect={onSelect}
              onDelete={onDelete}
              openFolders={openFolders}
              onToggle={handleToggleFolder}
            />
          ))
        )}
      </div>
    </div>
  )
}
