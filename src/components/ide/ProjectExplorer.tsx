"use client"

import { ChevronDown, ChevronRight, File, Folder, FolderOpen, MoreVertical, Plus } from "lucide-react"
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

function TreeNode({ node, depth = 0 }: { node: FileNode, depth?: number }) {
  const [isOpen, setIsOpen] = useState(node.isOpen || false)
  const isFolder = node.type === 'folder'

  return (
    <div className="select-none">
      <div 
        onClick={() => isFolder && setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1 py-1 px-2 cursor-pointer hover:bg-white/5 text-sm rounded-sm transition-colors",
          depth > 0 && `ml-${depth * 2}`
        )}
      >
        {isFolder ? (
          isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />
        ) : <div className="w-3" />}
        {isFolder ? (
          isOpen ? <FolderOpen className="h-4 w-4 text-primary/80" /> : <Folder  className="h-4 w-4 text-primary/80" />
        ) : <File className="h-4 w-4 text-muted-foreground" />}
        <span className={cn(isFolder ? "font-medium" : "text-muted-foreground")}>{node.name}</span>
      </div>
      {isFolder && isOpen && node.children?.map((child) => (
        <TreeNode key={child.id} node={child} depth={depth + 1} />
      ))}
    </div>
  )
}

export function ProjectExplorer({ searchQuery = '' }: { searchQuery?: string }) {
  const [files, setFiles] = useState<FileNode[]>(initialFiles)

  const handleAddFolder = () => {
    const name = window.prompt("Enter folder name:")
    if (!name) return
    const newNode: FileNode = {
      id: `folder-${Date.now()}`,
      name,
      type: 'folder',
      children: []
    }
    setFiles([...files, newNode])
  }

  const handleAddFile = () => {
    const name = window.prompt("Enter file name:")
    if (!name) return
    const newNode: FileNode = {
      id: `file-${Date.now()}`,
      name,
      type: 'file'
    }
    setFiles([...files, newNode])
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
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Explorer</span>
        <div className="flex gap-1">
          <button onClick={handleAddFolder} title="New Folder">
            <Plus className="h-4 w-4 cursor-pointer hover:text-primary transition-colors" />
          </button>
          <button onClick={handleAddFile} title="New File">
            <MoreVertical className="h-4 w-4 cursor-pointer hover:text-primary transition-colors" />
          </button>
        </div>
      </div>
      <div className="p-2 overflow-y-auto custom-scrollbar flex-1">
        {filteredFiles.length > 0 ? (
          filteredFiles.map((node) => (
            <TreeNode key={node.id} node={node} />
          ))
        ) : (
          <div className="p-4 text-xs text-muted-foreground italic text-center">No files found</div>
        )}
      </div>
    </div>
  )
}
