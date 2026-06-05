
"use client"

import React, { useEffect, useRef } from "react"
import Editor, { OnMount } from "@monaco-editor/react"

interface CodeEditorProps {
  code: string
  fileName: string
  onChange?: (val: string) => void
}

export function CodeEditor({ code, fileName, onChange }: CodeEditorProps) {
  const editorRef = useRef<any>(null)

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor

    // Custom theme configuration for Cyber Dark
    monaco.editor.defineTheme('cyber-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6272a4' },
        { token: 'keyword', foreground: '00BFFF' },
        { token: 'string', foreground: '8A2BE2' },
        { token: 'number', foreground: 'ffb86c' },
        { token: 'type', foreground: '8be9fd' },
      ],
      colors: {
        'editor.background': '#0D1117',
        'editor.foreground': '#E6EDF3',
        'editorCursor.foreground': '#00BFFF',
        'editor.lineHighlightBackground': '#1a1f26',
        'editorLineNumber.foreground': '#4b5563',
        'editor.selectionBackground': '#00BFFF44',
        'editor.inactiveSelectionBackground': '#00BFFF22',
      }
    })

    monaco.editor.setTheme('cyber-dark')
  }

  const getLanguage = (name: string) => {
    const ext = name.split('.').pop()
    switch (ext) {
      case 'tsx':
      case 'ts':
        return 'typescript'
      case 'jsx':
      case 'js':
        return 'javascript'
      case 'css':
        return 'css'
      case 'html':
        return 'html'
      case 'md':
        return 'markdown'
      case 'json':
        return 'json'
      default:
        return 'typescript'
    }
  }

  return (
    <div className="flex-1 w-full h-full bg-[#0D1117] relative">
      <Editor
        height="100%"
        width="100%"
        language={getLanguage(fileName)}
        value={code}
        theme="cyber-dark"
        onChange={(value) => onChange?.(value || "")}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', monospace",
          lineHeight: 24,
          padding: { top: 16, bottom: 16 },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,
          renderLineHighlight: "all",
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          }
        }}
      />
    </div>
  )
}
