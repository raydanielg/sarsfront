"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { IconSearch, IconArrowLeft, IconMapPin, IconFileText } from "@tabler/icons-react"

import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@workspace/ui/components/table"
import { SiteHeader } from "@/components/site-header"
import { TableSkeleton, SearchSkeleton } from "@/components/loading-states"
import {
  getRegionByCode,
  getDistricts,
  getRegionSummaries,
  type District,
  type SummaryPdf,
} from "@/lib/regions"

function districtSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "_")
}

const cellColors = [
  "bg-sky-100 hover:bg-sky-200 dark:bg-sky-950/50 dark:hover:bg-sky-900/60",
  "bg-pink-100 hover:bg-pink-200 dark:bg-pink-950/50 dark:hover:bg-pink-900/60",
  "bg-green-100 hover:bg-green-200 dark:bg-green-950/50 dark:hover:bg-green-900/60",
]

export default function DistrictsPage() {
  const params = useParams()
  const regionCode = (params.code as string)?.replace("reg_", "") ?? ""
  const region = getRegionByCode(regionCode)
  const districts = getDistricts(regionCode)
  const summaryPdfs = getRegionSummaries(regionCode)

  const [search, setSearch] = React.useState("")
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const filtered = React.useMemo(() => {
    return districts.filter((d) =>
      d.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [districts, search])

  const rows = React.useMemo(() => {
    const result: (District | null)[][] = []
    for (let i = 0; i < filtered.length; i += 3) {
      result.push([
        filtered[i] ?? null,
        filtered[i + 1] ?? null,
        filtered[i + 2] ?? null,
      ])
    }
    return result
  }, [filtered])

  if (!region) {
    return (
      <div className="min-h-svh bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h2 className="font-heading text-xl font-semibold">Mkoa haujapatikana</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Mkoa uliouchagua haupo kwenye orodha.
          </p>
          <Button render={<Link href="/" />} nativeButton={false} variant="outline" className="mt-4 gap-2">
            <IconArrowLeft className="size-4" />
            Rudi kwenye mikoa
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-background">
      <SiteHeader />

      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back button */}
        <Button
          render={<Link href="/" />}
          nativeButton={false}
          variant="ghost"
          size="sm"
          className="mb-4 gap-1.5"
        >
          <IconArrowLeft className="size-4" />
          Rudi kwenye mikoa
        </Button>

        {/* Region label */}
        <div className="mb-6 flex items-center gap-2">
          <IconMapPin className="size-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">
            Mkoa wa {region.name}
          </span>
        </div>

        {/* Search */}
        {loading ? (
          <SearchSkeleton />
        ) : (
          <div className="mb-6">
            <div className="relative">
              <IconSearch className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tafuta wilaya..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 w-full rounded-lg pl-10 pr-3 text-sm"
              />
            </div>
          </div>
        )}

        {/* Districts Table */}
        {loading ? (
          <TableSkeleton rows={4} cols={3} />
        ) : (
          <Table className="border-x-0 border-y">
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="h-32 text-center text-muted-foreground"
                >
                  Hakuna wilaya iliopatikana kwa &ldquo;{search}&rdquo;
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, i) => (
                <TableRow key={i} className="border-border/60">
                  {row.map((district, j) => (
                    <TableCell
                      key={j}
                      className={`border border-border/60 px-3 py-3 align-middle transition-colors ${cellColors[j]}`}
                    >
                      {district ? (
                        <Link
                          href={`/results/reg_${regionCode}/${districtSlug(district.name)}`}
                          className="text-sm font-medium text-primary transition-colors hover:text-primary/80 dark:text-primary dark:hover:text-primary/90 underline-offset-2 hover:underline"
                        >
                          {district.name}
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

        {/* Region Summary PDFs */}
        {!loading && summaryPdfs.length > 0 && (
          <div className="mt-8">
            <div className="mb-3 flex items-center gap-2">
              <IconFileText className="size-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                Muhtasari wa Mkoa wa {region.name}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {summaryPdfs.map((pdf: SummaryPdf) => (
                <Link
                  key={pdf.pdfPath}
                  href={`/results/reg_${regionCode}/summary/${encodeURIComponent(pdf.fileName)}`}
                  className="flex items-center gap-3 rounded-lg border border-border/60 bg-card px-4 py-3 text-sm transition-all hover:shadow-md"
                >
                  <IconFileText className="size-4 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1 truncate font-medium text-primary underline-offset-2 hover:underline">
                    {pdf.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

      </section>
    </div>
  )
}
