"use client"

import { ChevronDown, ChevronRight, File, Folder, FolderOpen, Trash2, Plus, FilePlus } from "lucide-react"
import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"

interface FileNode {
  id: string
  name: string
  type: 'file' | 'folder'
  children?: FileNode[]
  isOpen?: boolean
}

const initialFiles: FileNode[] = [
  {
    id: 'src',
    name: 'src',
    type: 'folder',
    isOpen: true,
    children: [
      { id: 'app.tsx', name: 'app.tsx', type: 'file' },
      { id: 'styles.css', name: 'styles.css', type: 'file' },
      { id: 'components', name: 'components', type: 'folder', children: [
        { id: 'Button.tsx', name: 'Button.tsx', type: 'file' },
        { id: 'Header.tsx', name: 'Header.tsx', type: 'file' }
      ]}
    ]
  },
  { id: 'package.json', name: 'package.json', type: 'file' },
  { id: 'tsconfig.json', name: 'tsconfig.json', type: 'file' }
]

function TreeNode({ 
  node, 
  depth = 0, 
  selectedId, 
  onSelect, 
  onDelete,
  onToggle
}: { 
  node: FileNode, 
  depth?: number,
  selectedId: string | null,
  onSelect: (id: string) => void,
  onDelete: (id: string) => void,
  onToggle: (id: string) => void
}) {
  const isFolder = node.type === 'folder'
  const isSelected = selectedId === node.id

  return (
    <div className="select-none">
      <div 
        onClick={() => {
          onSelect(node.id)
          if (isFolder) onToggle(node.id)
        }}
        className={cn(
          "group flex items-center gap-1 py-1 px-2 cursor-pointer hover:bg-white/5 text-sm rounded-sm transition-all border-l-2",
          isSelected 
            ? "bg-primary/10 text-primary border-primary shadow-[inset_4px_0_0_0_hsl(var(--primary))]" 
            : "text-muted-foreground border-transparent hover:text-foreground"
        )}
        style={{ paddingLeft: `${(depth * 12) + 8}px` }}
      >
        {isFolder ? (
          node.isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />
        ) : <div className="w-3.5" />}
        
        {isFolder ? (
          node.isOpen ? <FolderOpen className="h-4 w-4 text-primary/80" /> : <Folder  className="h-4 w-4 text-primary/80" />
        ) : <File className="h-4 w-4 text-muted-foreground" />}
        
        <span className={cn("truncate flex-1", isFolder && "font-medium")}>{node.name}</span>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(node.id);
          }}
          className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-all"
          title="Delete"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
      
      {isFolder && node.isOpen && node.children?.map((child) => (
        <TreeNode 
          key={child.id} 
          node={child} 
          depth={depth + 1}
          selectedId={selectedId}
          onSelect={onSelect}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </div>
  )
}

export function ProjectExplorer({ searchQuery = '' }: { searchQuery?: string }) {
  const [files, setFiles] = useState<FileNode[]>(initialFiles)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleToggleFolder = (id: string) => {
    const updateNodes = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.id === id) {
          return { ...node, isOpen: !node.isOpen }
        }
        if (node.children) {
          return { ...node, children: updateNodes(node.children) }
        }
        return node
      })
    }
    setFiles(updateNodes(files))
  }

  const handleAdd = (type: 'file' | 'folder') => {
    const name = window.prompt(`Enter ${type} name:`)
    if (!name) return

    const newNode: FileNode = {
      id: `${type}-${Date.now()}`,
      name,
      type,
      isOpen: type === 'folder',
      children: type === 'folder' ? [] : undefined
    }

    if (!selectedId) {
      setFiles([...files, newNode])
      return
    }

    const addToTree = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.id === selectedId) {
          // If a folder is selected, add inside
          if (node.type === 'folder') {
            return { 
              ...node, 
              isOpen: true, 
              children: [...(node.children || []), newNode] 
            }
          }
          // If a file is selected, we'll just add it at the same level (sibling)
          // In this simple implementation, if it's a file, we can't easily find the parent array here 
          // without a different tree traversal, so for MVP we'll add at root or do nothing.
          return node
        }
        if (node.children) {
          const newChildren = addToTree(node.children)
          // Check if any child was the target (to handle file sibling logic if needed, but let's keep it simple)
          const wasModified = newChildren !== node.children
          if (wasModified) return { ...node, children: newChildren }
          
          // Special case: if the selectedId is a child of this node and it's a file, we add newNode here
          const selectedChild = node.children.find(c => c.id === selectedId)
          if (selectedChild && selectedChild.type === 'file') {
             return { ...node, children: [...node.children, newNode] }
          }
        }
        return node
      })
    }

    // Attempt to add. If the selected node is a top-level file, newNode becomes a top-level item.
    const rootModified = files.some(f => f.id === selectedId && f.type === 'file')
    if (rootModified) {
      setFiles([...files, newNode])
    } else {
      setFiles(addToTree(files))
    }
  }

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this?")) return

    const removeFromTree = (nodes: FileNode[]): FileNode[] => {
      return nodes
        .filter(node => node.id !== id)
        .map(node => ({
          ...node,
          children: node.children ? removeFromTree(node.children) : undefined
        }))
    }

    setFiles(removeFromTree(files))
    if (selectedId === id) setSelectedId(null)
  }

  const filteredFiles = useMemo(() => {
    if (!searchQuery) return files
    
    const filterNodes = (nodes: FileNode[]): FileNode[] => {
      return nodes.reduce((acc: FileNode[], node) => {
        const matches = node.name.toLowerCase().includes(searchQuery.toLowerCase())
        let childrenMatches: FileNode[] = []
        
        if (node.children) {
          childrenMatches = filterNodes(node.children)
        }
        
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
        <div className="flex gap-2">
          <button 
            onClick={() => handleAdd('folder')} 
            className="p-1 hover:text-primary transition-colors rounded hover:bg-white/5" 
            title="New Folder"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleAdd('file')} 
            className="p-1 hover:text-primary transition-colors rounded hover:bg-white/5" 
            title="New File"
          >
            <FilePlus className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="p-2 overflow-y-auto custom-scrollbar flex-1">
        {filteredFiles.length > 0 ? (
          filteredFiles.map((node) => (
            <TreeNode 
              key={node.id} 
              node={node} 
              selectedId={selectedId}
              onSelect={setSelectedId}
              onDelete={handleDelete}
              onToggle={handleToggleFolder}
            />
          ))
        ) : (
          <div className="p-8 text-center">
            <p className="text-[10px] text-muted-foreground italic uppercase tracking-widest">No matching nodes</p>
          </div>
        )}
      </div>
    </div>
  )
}
