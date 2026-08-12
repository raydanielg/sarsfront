"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { IconSearch, IconArrowLeft, IconMapPin } from "@tabler/icons-react"

import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { SiteHeader } from "@/components/site-header"
import { TableSkeleton, SearchSkeleton } from "@/components/loading-states"
import {
  getRegionByCode,
  getDistrict,
  getSchools,
  type School,
} from "@/lib/regions"

const columnColors = [
  "bg-sky-50 dark:bg-sky-950/30",
  "bg-pink-50 dark:bg-pink-950/30",
  "bg-green-50 dark:bg-green-950/30",
]

const columnBorders = [
  "border-sky-200 dark:border-sky-800/50",
  "border-pink-200 dark:border-pink-800/50",
  "border-green-200 dark:border-green-800/50",
]

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

export default function SchoolsPage() {
  const params = useParams()
  const regionCode = (params.code as string)?.replace("reg_", "") ?? ""
  const districtSlugParam = (params.district as string) ?? ""
  const region = getRegionByCode(regionCode)
  const district = getDistrict(regionCode, districtSlugParam)
  const schools = getSchools(regionCode, districtSlugParam)

  const [search, setSearch] = React.useState("")
  const [activeLetter, setActiveLetter] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const filtered = React.useMemo(() => {
    let result = schools.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.examNo.toLowerCase().includes(search.toLowerCase())
    )
    if (activeLetter) {
      result = result.filter((s) =>
        s.name.toUpperCase().startsWith(activeLetter)
      )
    }
    return result
  }, [schools, search, activeLetter])

  const columns = React.useMemo(() => {
    const cols: School[][] = [[], [], []]
    filtered.forEach((school, i) => {
      cols[i % 3]!.push(school)
    })
    return cols
  }, [filtered])

  if (!region || !district) {
    return (
      <div className="min-h-svh bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h2 className="font-heading text-xl font-semibold">Wilaya haijapatikana</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Wilaya uliyoichagua haipo kwenye orodha.
          </p>
          <Button
            render={<Link href={region ? `/results/reg_${regionCode}` : "/"} />}
            nativeButton={false}
            variant="outline"
            className="mt-4 gap-2"
          >
            <IconArrowLeft className="size-4" />
            Rudi nyuma
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-background">
      <SiteHeader />

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back button */}
        <Button
          render={<Link href={`/results/reg_${regionCode}`} />}
          nativeButton={false}
          variant="ghost"
          size="sm"
          className="mb-4 gap-1.5"
        >
          <IconArrowLeft className="size-4" />
          Rudi kwenye wilaya
        </Button>

        {/* Region & District label */}
        <div className="mb-6 flex items-center gap-2">
          <IconMapPin className="size-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">
            {region.name} &middot; Wilaya ya {district.name}
          </span>
        </div>

        {/* Search */}
        {loading ? (
          <SearchSkeleton />
        ) : (
          <div className="mb-4">
            <div className="relative">
              <IconSearch className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Andika jina la shule, mf. 'AZIMIO' au 'PS1308001'"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setActiveLetter(null)
                }}
                className="h-11 w-full rounded-lg pl-10 pr-3 text-sm"
              />
            </div>
          </div>
        )}

        {/* Alphabet filter */}
        {!loading && (
          <div className="mb-6 flex flex-wrap items-center gap-1">
            <button
              onClick={() => setActiveLetter(null)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                activeLetter === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
              }`}
            >
              ALL
            </button>
            {letters.map((letter) => (
              <button
                key={letter}
                onClick={() => setActiveLetter(letter)}
                className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                  activeLetter === letter
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        )}

        {/* Schools - 3 column layout */}
        {loading ? (
          <TableSkeleton rows={4} cols={3} />
        ) : filtered.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
            Hakuna shule iliopatikana kwa &ldquo;{search}&rdquo;
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {columns.map((col, colIdx) => (
              <div
                key={colIdx}
                className={`rounded-lg border ${columnBorders[colIdx]} ${columnColors[colIdx]} overflow-hidden`}
              >
                {col.map((school) => (
                  <Link
                    key={school.examNo}
                    href={`/results/reg_${regionCode}/${districtSlugParam}/${school.examNo}`}
                    className="flex items-baseline gap-2 border-b border-border/40 px-3 py-2.5 text-sm transition-colors last:border-b-0 hover:bg-muted/40"
                  >
                    <span className="shrink-0 font-mono text-xs font-bold text-muted-foreground">
                      {school.examNo}
                    </span>
                    <span className="font-semibold uppercase leading-tight tracking-wide text-primary underline-offset-2 hover:underline">
                      {school.name}
                    </span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        )}

      </section>
    </div>
  )
}
