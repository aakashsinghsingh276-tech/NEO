"use client"

import { ChevronDown, ChevronRight, File, Folder, FolderOpen, MoreVertical, Plus } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface FileNode {
  name: string
  type: 'file' | 'folder'
  children?: FileNode[]
  isOpen?: boolean
}

const mockFiles: FileNode[] = [
  {
    name: 'src',
    type: 'folder',
    isOpen: true,
    children: [
      { name: 'app.tsx', type: 'file' },
      { name: 'styles.css', type: 'file' },
      { name: 'components', type: 'folder', children: [
        { name: 'Button.tsx', type: 'file' },
        { name: 'Header.tsx', type: 'file' }
      ]}
    ]
  },
  { name: 'package.json', type: 'file' },
  { name: 'tsconfig.json', type: 'file' }
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
      {isFolder && isOpen && node.children?.map((child, i) => (
        <TreeNode key={i} node={child} depth={depth + 1} />
      ))}
    </div>
  )
}

export function ProjectExplorer() {
  return (
    <div className="w-[240px] bg-sidebar/50 border-r border-border h-full flex flex-col">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Explorer</span>
        <div className="flex gap-1">
          <Plus className="h-4 w-4 cursor-pointer hover:text-primary transition-colors" />
          <MoreVertical className="h-4 w-4 cursor-pointer hover:text-primary transition-colors" />
        </div>
      </div>
      <div className="p-2 overflow-y-auto custom-scrollbar flex-1">
        {mockFiles.map((node, i) => (
          <TreeNode key={i} node={node} />
        ))}
      </div>
    </div>
  )
}