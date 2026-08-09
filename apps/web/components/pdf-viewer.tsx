"use client"

import * as React from "react"
import {
  Document,
  Page,
  pdfjs,
} from "react-pdf"
import {
  IconZoomIn,
  IconZoomOut,
  IconDownload,
  IconMaximize,
  IconMinimize,
} from "@tabler/icons-react"

import { Button } from "@workspace/ui/components/button"

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

type PDFViewerProps = {
  src: string
  fileName?: string
}

export function PDFViewer({ src, fileName = "document.pdf" }: PDFViewerProps) {
  const [numPages, setNumPages] = React.useState(0)
  const [scale, setScale] = React.useState(1.0)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [containerWidth, setContainerWidth] = React.useState(0)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const wrapperRef = React.useRef<HTMLDivElement>(null)

  // Touch gesture state
  const touchState = React.useRef({
    startDist: 0,
    startScale: 1,
    startY: 0,
    startX: 0,
    isPinching: false,
  })

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setLoading(false)
    setError(null)
  }

  function onDocumentLoadError(err: Error) {
    setLoading(false)
    setError(err.message)
  }

  React.useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth)
      }
    }
    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  // Pinch-to-zoom touch handling
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const t0 = e.touches[0]!
      const t1 = e.touches[1]!
      const dist = Math.hypot(
        t0.clientX - t1.clientX,
        t0.clientY - t1.clientY
      )
      touchState.current = {
        startDist: dist,
        startScale: scale,
        startY: 0,
        startX: 0,
        isPinching: true,
      }
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchState.current.isPinching) {
      e.preventDefault()
      const t0 = e.touches[0]!
      const t1 = e.touches[1]!
      const dist = Math.hypot(
        t0.clientX - t1.clientX,
        t0.clientY - t1.clientY
      )
      const ratio = dist / touchState.current.startDist
      const newScale = Math.min(3.0, Math.max(0.5, touchState.current.startScale * ratio))
      setScale(newScale)
    }
  }

  const handleTouchEnd = () => {
    touchState.current.isPinching = false
  }

  const pageWidth = containerWidth
    ? Math.min(containerWidth - 24, 800 * scale)
    : undefined

  // Auto-fit scale to container width on initial load
  React.useEffect(() => {
    if (containerWidth && numPages) {
      const fitWidth = (containerWidth - 24) / 800
      if (fitWidth < 1 && scale === 1.0) {
        setScale(Math.max(0.5, fitWidth))
      }
    }
  }, [containerWidth, numPages])

  const pages = Array.from({ length: numPages }, (_, i) => i + 1)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      wrapperRef.current?.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
  }

  React.useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener("fullscreenchange", onChange)
    return () => document.removeEventListener("fullscreenchange", onChange)
  }, [])

  return (
    <div ref={wrapperRef} className="relative flex h-full min-h-0 flex-col bg-background dark:bg-zinc-950">
      {/* PDF Content - all pages in scroll view */}
      <div
        ref={containerRef}
        className="min-h-0 flex-1 overflow-auto p-2 sm:p-3 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {loading && (
          <div className="flex h-full items-center justify-center">
            <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}

        {error && (
          <div className="flex h-full items-center justify-center p-4">
            <p className="text-sm text-destructive">
              Hitilafu kwenye kupakia PDF: {error}
            </p>
          </div>
        )}

        <Document
          file={src}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={null}
          className={loading || error ? "hidden" : "flex flex-col items-center gap-3"}
        >
          {pages.map((pageNum) => (
            <Page
              key={pageNum}
              pageNumber={pageNum}
              scale={scale}
              width={pageWidth}
              className="rounded-lg shadow-md"
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          ))}
        </Document>
      </div>

      {/* Floating bottom controls */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center p-3 sm:p-4">
        <div className="pointer-events-auto flex items-center gap-1.5 rounded-xl border border-border/80 bg-background/90 p-1.5 shadow-lg backdrop-blur-md dark:bg-zinc-900/90">
          {/* Zoom out */}
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-lg"
            onClick={() => setScale((s) => Math.max(0.5, s - 0.25))}
            disabled={scale <= 0.5}
          >
            <IconZoomOut className="size-4" />
          </Button>

          {/* Scale display + reset */}
          <button
            onClick={() => setScale(1.0)}
            className="min-w-[3.5rem] rounded-lg px-2 py-1 text-center text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground tabular-nums"
          >
            {Math.round(scale * 100)}%
          </button>

          {/* Zoom in */}
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-lg"
            onClick={() => setScale((s) => Math.min(3.0, s + 0.25))}
            disabled={scale >= 3.0}
          >
            <IconZoomIn className="size-4" />
          </Button>

          <div className="mx-0.5 h-5 w-px bg-border" />

          {/* Page count */}
          <span className="min-w-[3rem] rounded-lg px-2 py-1 text-center text-xs font-medium text-muted-foreground tabular-nums">
            {numPages || "..."} kurasa
          </span>

          <div className="mx-0.5 h-5 w-px bg-border" />

          {/* Fullscreen */}
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-lg"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <IconMinimize className="size-4" /> : <IconMaximize className="size-4" />}
          </Button>

          <div className="mx-0.5 h-5 w-px bg-border" />

          {/* Download */}
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-lg"
            nativeButton={false}
            render={<a href={src} download={fileName} />}
          >
            <IconDownload className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
