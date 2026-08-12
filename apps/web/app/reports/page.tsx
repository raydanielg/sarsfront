"use client"

import * as React from "react"
import Link from "next/link"
import {
  IconArrowLeft,
  IconTrophy,
  IconBook2,
  IconTrendingUp,
  IconSchool,
  IconUsers,
  IconMapPin,
  IconChevronRight,
} from "@tabler/icons-react"

import { Button } from "@workspace/ui/components/button"
import { SiteHeader } from "@/components/site-header"

const reports = [
  {
    title: "School Ranks",
    description: "Regional ranking of all schools based on performance.",
    icon: IconTrophy,
    bg: "bg-amber-500",
  },
  {
    title: "Subject Performance",
    description: "Detailed analysis of performance by subject across the region.",
    icon: IconBook2,
    bg: "bg-sky-500",
  },
  {
    title: "Mobility Analysis",
    description: "Tracking schools that have improved or declined in performance compared to previous exams.",
    icon: IconTrendingUp,
    bg: "bg-green-500",
  },
  {
    title: "School Statistics",
    description: "Detailed statistical analysis of school performance, including government and private school comparisons.",
    icon: IconSchool,
    bg: "bg-pink-500",
  },
  {
    title: "Student Statistics",
    description: "Detailed analysis of student performance, including top performers overall and by subject.",
    icon: IconUsers,
    bg: "bg-purple-500",
  },
  {
    title: "District Ranks",
    description: "Ranking of all districts in the region based on their overall performance.",
    icon: IconMapPin,
    bg: "bg-orange-500",
  },
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
            Reports
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Chagua ripoti unayotaka kuangalia kutoka kwenye orodha hapa chini.
          </p>
        </div>

        {/* Reports list */}
        {loading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-xl border border-border/60 bg-muted/40"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {reports.map((report) => (
              <div
                key={report.title}
                className="flex items-center gap-4 rounded-xl border border-border/60 bg-card p-4 transition-all hover:shadow-md sm:p-5"
              >
                <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${report.bg}`}>
                  <report.icon className="size-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-foreground">
                    {report.title}
                  </h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {report.description}
                  </p>
                </div>
                <IconChevronRight className="size-5 shrink-0 text-muted-foreground" />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
