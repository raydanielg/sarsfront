"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { IconArrowLeft, IconMapPin, IconFileText, IconSearch } from "@tabler/icons-react"

import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { SiteHeader } from "@/components/site-header"
import { SearchSkeleton } from "@/components/loading-states"
import {
  getRegionByCode,
  getDistrict,
  getDistrictSummaries,
  type SummaryPdf,
} from "@/lib/regions"

export default function DistrictSummaryPage() {
  const params = useParams()
  const regionCode = (params.code as string)?.replace("reg_", "") ?? ""
  const districtSlugParam = (params.district as string) ?? ""
  const region = getRegionByCode(regionCode)
  const district = getDistrict(regionCode, districtSlugParam)
  const districtSummaries = getDistrictSummaries(regionCode, districtSlugParam)

  const [search, setSearch] = React.useState("")
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const filtered = React.useMemo(() => {
    return districtSummaries.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [districtSummaries, search])

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
          render={<Link href={`/results/reg_${regionCode}/${districtSlugParam}`} />}
          nativeButton={false}
          variant="ghost"
          size="sm"
          className="mb-4 gap-1.5"
        >
          <IconArrowLeft className="size-4" />
          Rudi kwenye shule
        </Button>

        {/* Region & District label */}
        <div className="mb-6 flex items-center gap-2">
          <IconMapPin className="size-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">
            Muhtasari wa Wilaya ya {district.name} &middot; {region.name}
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
                placeholder="Tafuta muhtasari..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 w-full rounded-lg pl-10 pr-3 text-sm"
              />
            </div>
          </div>
        )}

        {/* Summary PDFs list */}
        {loading ? (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg border border-border/60 bg-muted/40" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
            Hakuna muhtasari uliopatikana kwa &ldquo;{search}&rdquo;
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {filtered.map((pdf: SummaryPdf) => (
              <Link
                key={pdf.pdfPath}
                href={`/results/reg_${regionCode}/${districtSlugParam}/summary/${encodeURIComponent(pdf.fileName)}`}
                className="flex items-center gap-3 rounded-lg border border-border/60 bg-card px-4 py-3.5 text-sm transition-all hover:shadow-md"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <IconFileText className="size-4 text-primary" />
                </div>
                <span className="min-w-0 flex-1 truncate font-medium text-primary underline-offset-2 hover:underline">
                  {pdf.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
