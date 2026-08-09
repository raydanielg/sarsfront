"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { IconSearch, IconArrowLeft, IconMapPin } from "@tabler/icons-react"

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
import { getRegionByCode, getDistricts, getSchools, type School } from "@/lib/regions"

const cellColors = [
  "bg-sky-100 hover:bg-sky-200 dark:bg-sky-950/50 dark:hover:bg-sky-900/60",
  "bg-pink-100 hover:bg-pink-200 dark:bg-pink-950/50 dark:hover:bg-pink-900/60",
  "bg-green-100 hover:bg-green-200 dark:bg-green-950/50 dark:hover:bg-green-900/60",
]

export default function SchoolsPage() {
  const params = useParams()
  const regionCode = (params.code as string)?.replace("reg_", "") ?? ""
  const districtCode = (params.district as string) ?? ""
  const region = getRegionByCode(regionCode)
  const districts = getDistricts(regionCode)
  const district = districts.find((d) => d.code === districtCode)
  const schools = getSchools(regionCode, districtCode)

  const [search, setSearch] = React.useState("")
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const filtered = React.useMemo(() => {
    return schools.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [schools, search])

  const rows = React.useMemo(() => {
    const result: (School | null)[][] = []
    for (let i = 0; i < filtered.length; i += 3) {
      result.push([
        filtered[i] ?? null,
        filtered[i + 1] ?? null,
        filtered[i + 2] ?? null,
      ])
    }
    return result
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

      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
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

        {/* NECTA Header */}
        <div className="mb-6 text-center">
          <h2 className="font-heading text-xl font-bold text-primary sm:text-2xl">
            NATIONAL EXAMINATIONS COUNCIL OF TANZANIA
          </h2>
          <h3 className="mt-2 text-base font-semibold underline decoration-primary/50 underline-offset-4 sm:text-lg">
            STANDARD FOUR NATIONAL ASSESSMENT (SFNA) &mdash; 2024 RESULTS
          </h3>
          <div className="mt-3 flex items-center justify-center gap-2">
            <IconMapPin className="size-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              {region.name} &middot; Wilaya ya {district.name}
            </span>
          </div>
        </div>

        <hr className="mb-6 border-border" />

        {/* Search */}
        {loading ? (
          <SearchSkeleton />
        ) : (
          <div className="mb-6">
            <div className="relative">
              <IconSearch className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tafuta shule..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 w-full rounded-lg pl-10 pr-3 text-sm"
              />
            </div>
          </div>
        )}

        {/* Schools Table */}
        {loading ? (
          <TableSkeleton rows={6} cols={1} />
        ) : (
          <div className="overflow-hidden rounded-lg border border-border/60">
            <div className="divide-y divide-border/60">
              {rows.length === 0 ? (
                <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                  Hakuna shule iliopatikana kwa &ldquo;{search}&rdquo;
                </div>
              ) : (
                filtered.map((school, i) => (
                  <Link
                    key={school.code}
                    href={`/results/reg_${regionCode}/${districtCode}/${school.code}`}
                    className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40 ${
                      i % 2 === 0
                        ? "bg-sky-50 dark:bg-sky-950/30"
                        : "bg-pink-50 dark:bg-pink-950/30"
                    }`}
                  >
                    <span className="shrink-0 font-mono text-xs font-semibold text-muted-foreground">
                      {school.examNo}
                    </span>
                    <span className="truncate text-sm font-bold uppercase tracking-wide text-primary">
                      {school.name}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Result Management System &middot; {region.name} &middot; {district.name}{" "}
          &middot; {new Date().getFullYear()}
        </p>
      </section>
    </div>
  )
}
