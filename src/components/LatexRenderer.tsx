import React, { useMemo } from 'react'
import katex from 'katex'

interface LatexRendererProps {
  latex: string
  displayMode?: boolean
  className?: string
}

export const LatexRenderer: React.FC<LatexRendererProps> = ({
  latex,
  displayMode = false,
  className = ''
}) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        displayMode,
        throwOnError: false
      })
    } catch {
      return latex
    }
  }, [latex, displayMode])

  return (
    <span
      className={`inline-block select-none ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
