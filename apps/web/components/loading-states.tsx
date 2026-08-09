"use client"

import { cn } from "@workspace/ui/lib/utils"

export function TableSkeleton({ rows = 6, cols = 3 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/80">
      <div className="divide-y divide-border/60">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {Array.from({ length: cols }).map((_, j) => (
              <div
                key={j}
                className={cn(
                  "border-border/60 p-3",
                  j > 0 && "border-l",
                  i % 2 === 0 ? "bg-muted/30" : "bg-muted/10"
                )}
              >
                <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted-foreground/20" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function PageSpinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20">
      <div className="size-10 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary" />
      {label && (
        <p className="text-sm text-muted-foreground">{label}</p>
      )}
    </div>
  )
}

export function SearchSkeleton() {
  return (
    <div className="mb-6">
      <div className="h-11 w-full animate-pulse rounded-lg bg-muted-foreground/15" />
    </div>
  )
}
