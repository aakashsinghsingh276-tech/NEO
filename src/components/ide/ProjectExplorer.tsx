"use client"

import { ChevronDown, ChevronRight, File, Folder, FolderOpen, Trash2, Plus, FilePlus } from "lucide-react"
import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { FileNode } from "@/app/page"

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
          "group flex items-center gap-1 py-1 px-2 cursor-pointer hover:bg-white/5 text-[11px] rounded-sm transition-all border-l-2",
          isSelected 
            ? "bg-primary/10 text-primary border-primary" 
            : "text-muted-foreground border-transparent hover:text-foreground"
        )}
        style={{ paddingLeft: `${(depth * 10) + 8}px` }}
      >
        {isFolder ? (
          node.isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />
        ) : <div className="w-3" />}
        
        {isFolder ? (
          node.isOpen ? <FolderOpen className="h-3.5 w-3.5 text-primary/80" /> : <Folder  className="h-3.5 w-3.5 text-primary/80" />
        ) : <File className="h-3.5 w-3.5 text-muted-foreground" />}
        
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

export function ProjectExplorer({ searchQuery = '', files, setFiles, selectedId, onSelect }: { 
  searchQuery?: string,
  files: FileNode[],
  setFiles: (f: FileNode[]) => void,
  selectedId: string | null,
  onSelect: (id: string) => void
}) {

  const handleToggleFolder = (id: string) => {
    const updateNodes = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.id === id) return { ...node, isOpen: !node.isOpen }
        if (node.children) return { ...node, children: updateNodes(node.children) }
        return node
      })
    }
    setFiles(updateNodes(files))
  }

  const handleAdd = (type: 'file' | 'folder') => {
    const name = window.prompt(`Enter ${type} name:`)
    if (!name) return

    const newNode: FileNode = {
      id: name + Date.now(),
      name,
      type,
      content: type === 'file' ? '' : undefined,
      isOpen: type === 'folder',
      children: type === 'folder' ? [] : undefined
    }

    const addToTree = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.id === selectedId && node.type === 'folder') {
          return { ...node, children: [...(node.children || []), newNode], isOpen: true }
        }
        if (node.children) {
          const newChildren = addToTree(node.children)
          if (newChildren !== node.children) return { ...node, children: newChildren }
        }
        return node
      })
    }

    if (!selectedId) {
      setFiles([...files, newNode])
    } else {
      setFiles(addToTree(files))
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
  }

  const filteredFiles = useMemo(() => {
    if (!searchQuery) return files
    const filterNodes = (nodes: FileNode[]): FileNode[] => {
      return nodes.reduce((acc: FileNode[], node) => {
        const matches = node.name.toLowerCase().includes(searchQuery.toLowerCase())
        let childrenMatches: FileNode[] = []
        if (node.children) childrenMatches = filterNodes(node.children)
        if (matches || childrenMatches.length > 0) {
          acc.push({ ...node, isOpen: true, children: node.children ? childrenMatches : undefined })
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
          <button onClick={() => handleAdd('folder')} className="p-1 hover:text-primary rounded hover:bg-white/5" title="New Folder">
            <Plus className="h-4 w-4" />
          </button>
          <button onClick={() => handleAdd('file')} className="p-1 hover:text-primary rounded hover:bg-white/5" title="New File">
            <FilePlus className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="p-2 overflow-y-auto custom-scrollbar flex-1">
        {filteredFiles.map((node) => (
          <TreeNode 
            key={node.id} 
            node={node} 
            selectedId={selectedId}
            onSelect={onSelect}
            onDelete={handleDelete}
            onToggle={handleToggleFolder}
          />
        ))}
      </div>
    </div>
  )
}
