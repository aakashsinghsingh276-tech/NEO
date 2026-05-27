"use client"

import { useEffect, useState } from "react"

export function CodeEditor({ code, language, onChange }: { 
  code: string, 
  language: string,
  onChange?: (val: string) => void 
}) {
  const [lines, setLines] = useState<string[]>([])

  useEffect(() => {
    setLines(code.split('\n'))
  }, [code])

  return (
    <div className="flex-1 flex font-code text-sm overflow-hidden bg-background">
      <div className="w-12 py-4 flex flex-col items-center text-muted-foreground/30 border-r border-border select-none bg-black/20">
        {lines.map((_, i) => (
          <div key={i} className="h-6 leading-6 text-xs">{i + 1}</div>
        ))}
      </div>
      <div className="flex-1 py-4 px-6 overflow-auto custom-scrollbar">
        <textarea
          className="w-full h-full bg-transparent border-none outline-none resize-none text-foreground leading-6 font-code"
          value={code}
          onChange={(e) => onChange?.(e.target.value)}
          spellCheck={false}
        />
      </div>
    </div>
  )
}