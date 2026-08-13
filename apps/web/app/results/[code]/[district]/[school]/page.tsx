"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"

import { PDFViewer } from "@/components/pdf-viewer"
import { getRegionByCode, getDistrict, getSchool } from "@/lib/regions"

export default function SchoolResultsPage() {
  const params = useParams()
  const regionCode = (params.code as string)?.replace("reg_", "") ?? ""
  const districtSlugParam = (params.district as string) ?? ""
  const schoolIdentifier = decodeURIComponent((params.school as string) ?? "")
  const region = getRegionByCode(regionCode)
  const district = getDistrict(regionCode, districtSlugParam)
  const school = getSchool(regionCode, districtSlugParam, schoolIdentifier)

  if (!region || !district || !school) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4 text-center">
        <h2 className="font-heading text-xl font-semibold">Shule haijapatikana</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Shule uliyoichagua haipo kwenye orodha.
        </p>
        <Button
          render={
            <Link
              href={
                region && district
                  ? `/results/reg_${regionCode}/${districtSlugParam}`
                  : region
                    ? `/results/reg_${regionCode}`
                    : "/"
              }
            />
          }
          nativeButton={false}
          variant="outline"
          className="mt-4 gap-2"
        >
          <IconArrowLeft className="size-4" />
          Rudi nyuma
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-background">
      <PDFViewer src={encodeURI(school.pdfPath)} fileName={school.fileName} />
    </div>
  )
}
