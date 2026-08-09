"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { IconArrowLeft } from "@tabler/icons-react"

import { Button } from "@workspace/ui/components/button"
import { SiteHeader } from "@/components/site-header"
import { PDFViewer } from "@/components/pdf-viewer"
import { getRegionByCode, getDistricts, getSchools } from "@/lib/regions"

export default function SchoolResultsPage() {
  const params = useParams()
  const regionCode = (params.code as string)?.replace("reg_", "") ?? ""
  const districtCode = (params.district as string) ?? ""
  const schoolCode = (params.school as string) ?? ""
  const region = getRegionByCode(regionCode)
  const districts = getDistricts(regionCode)
  const district = districts.find((d) => d.code === districtCode)
  const schools = getSchools(regionCode, districtCode)
  const school = schools.find((s) => s.code === schoolCode)

  if (!region || !district || !school) {
    return (
      <div className="min-h-svh bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h2 className="font-heading text-xl font-semibold">Shule haijapatikana</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Shule uliyoichagua haipo kwenye orodha.
          </p>
          <Button
            nativeButton={false}
            render={
              <Link
                href={
                  region && district
                    ? `/results/reg_${regionCode}/${districtCode}`
                    : region
                      ? `/results/reg_${regionCode}`
                      : "/"
                }
              />
            }
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

      <section className="mx-auto flex max-w-5xl flex-col px-3 py-4 sm:px-6 sm:py-6 lg:px-8" style={{ height: "calc(100vh - 3.5rem)" }}>
        {/* Top bar */}
        <div className="mb-3 flex shrink-0 items-center justify-between sm:mb-4">
          <Button
            nativeButton={false}
            render={
              <Link href={`/results/reg_${regionCode}/${districtCode}`} />
            }
            variant="ghost"
            size="sm"
            className="gap-1.5"
          >
            <IconArrowLeft className="size-4" />
            Rudi kwenye shule
          </Button>

          <div className="flex items-baseline gap-2">
            <span className="font-mono text-xs font-semibold text-muted-foreground">
              {school.examNo}
            </span>
            <span className="text-sm font-bold uppercase tracking-wide text-foreground">
              {school.name}
            </span>
          </div>
        </div>

        {/* PDF Viewer - fills remaining space */}
        <div className="min-h-0 flex-1">
          <PDFViewer src="/sample.pdf" fileName={`${school.name}.pdf`} />
        </div>

        <p className="mt-2 shrink-0 text-center text-xs text-muted-foreground sm:mt-3">
          Result Management System &middot; {region.name} &middot; {district.name}{" "}
          &middot; {school.name} &middot; {new Date().getFullYear()}
        </p>
      </section>
    </div>
  )
}
