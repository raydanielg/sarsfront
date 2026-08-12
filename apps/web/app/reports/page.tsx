"use client"

import * as React from "react"
import Link from "next/link"
import {
  IconArrowLeft,
  IconMapPin,
  IconFileText,
  IconChevronRight,
} from "@tabler/icons-react"

import { Button } from "@workspace/ui/components/button"
import { SiteHeader } from "@/components/site-header"
import { regions, getRegionSummaries } from "@/lib/regions"

function regionSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "_")
}

const regionColors = [
  "bg-sky-500",
  "bg-pink-500",
  "bg-green-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-orange-500",
]

export default function ReportsPage() {
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

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
          className="mb-6 gap-1.5"
        >
          <IconArrowLeft className="size-4" />
          Rudi nyumbani
        </Button>

        {/* Title */}
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Muhtasari wa Mikoa
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Chagua mkoa unaoataka kuona muhtasari wake kutoka kwenye orodha hapa chini.
          </p>
        </div>

        {/* Regions list */}
        {loading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Array.from({ length: regions.length }).map((_, i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-xl border border-border/60 bg-muted/40"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {regions.map((region, idx) => {
              const summaries = getRegionSummaries(regionSlug(region.name))
              return (
                <Link
                  key={region.name}
                  href={`/results/reg_${regionSlug(region.name)}/summary`}
                  className="flex items-center gap-4 rounded-xl border border-border/60 bg-card p-4 transition-all hover:shadow-md sm:p-5"
                >
                  <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${regionColors[idx % regionColors.length]}`}>
                    <IconMapPin className="size-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground">
                      {region.name}
                    </h3>
                    <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <IconFileText className="size-3.5" />
                      {summaries.length} muhtasari wa PDFs
                    </p>
                  </div>
                  <IconChevronRight className="size-5 shrink-0 text-muted-foreground" />
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
