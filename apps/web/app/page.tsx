"use client"

import * as React from "react"
import Link from "next/link"
import { IconSearch } from "@tabler/icons-react"

import { Input } from "@workspace/ui/components/input"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@workspace/ui/components/table"
import { SiteHeader } from "@/components/site-header"
import { TableSkeleton, SearchSkeleton } from "@/components/loading-states"
import { regions, type Region } from "@/lib/regions"

function regionSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "_")
}

const cellColors = [
  "bg-sky-100 hover:bg-sky-200 dark:bg-sky-950/50 dark:hover:bg-sky-900/60",
  "bg-pink-100 hover:bg-pink-200 dark:bg-pink-950/50 dark:hover:bg-pink-900/60",
  "bg-green-100 hover:bg-green-200 dark:bg-green-950/50 dark:hover:bg-green-900/60",
]

export default function Page() {
  const [search, setSearch] = React.useState("")
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const filtered = React.useMemo(() => {
    return regions.filter((r) =>
      r.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [search])

  const rows = React.useMemo(() => {
    const result: (Region | null)[][] = []
    for (let i = 0; i < filtered.length; i += 3) {
      result.push([
        filtered[i] ?? null,
        filtered[i + 1] ?? null,
        filtered[i + 2] ?? null,
      ])
    }
    return result
  }, [filtered])

  return (
    <div className="min-h-svh bg-background">
      <SiteHeader />

      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search */}
        {loading ? (
          <SearchSkeleton />
        ) : (
          <div className="mb-6">
            <div className="relative">
              <IconSearch className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tafuta mkoa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 w-full rounded-lg pl-10 pr-3 text-sm"
              />
            </div>
          </div>
        )}

        {/* Regions Table */}
        {loading ? (
          <TableSkeleton rows={9} cols={3} />
        ) : (
          <Table className="border-x-0 border-y">
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="h-32 text-center text-muted-foreground"
                >
                  Hakuna mkoa uliopatikana kwa &ldquo;{search}&rdquo;
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, i) => (
                <TableRow key={i} className="border-border/60">
                  {row.map((region, j) => (
                    <TableCell
                      key={j}
                      className={`border border-border/60 px-3 py-3 align-middle transition-colors ${cellColors[j]}`}
                    >
                      {region ? (
                        <Link
                          href={`/results/reg_${regionSlug(region.name)}`}
                          className="text-sm font-medium text-primary transition-colors hover:text-primary/80 dark:text-primary dark:hover:text-primary/90 underline-offset-2 hover:underline"
                        >
                          {region.name}
                        </Link>
                      ) : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        )}

      </section>
    </div>
  )
}
