import rawData from "./regions-data.json"

export type SummaryPdf = {
  name: string
  pdfPath: string
  fileName: string
}

export type School = {
  name: string
  examNo: string
  pdfPath: string
  fileName: string
}

export type District = {
  name: string
  folderName: string
  schools: School[]
  schoolCount: number
}

export type Region = {
  name: string
  folderName: string
  districts: District[]
  summaryPdfs: SummaryPdf[]
  districtSummaries: Record<string, SummaryPdf[]>
}

type RawData = {
  regions: Region[]
}

const data = rawData as unknown as RawData

export const regions: Region[] = data.regions

export function getRegionByCode(code: string): Region | undefined {
  return regions.find((r) => r.name.toLowerCase().replace(/\s+/g, "_") === code.toLowerCase())
}

export function getDistricts(regionCode: string): District[] {
  const region = getRegionByCode(regionCode)
  return region?.districts ?? []
}

export function getDistrict(regionCode: string, districtName: string): District | undefined {
  const districts = getDistricts(regionCode)
  return districts.find(
    (d) => d.name.toLowerCase().replace(/\s+/g, "_") === districtName.toLowerCase()
  )
}

export function getSchools(regionCode: string, districtName: string): School[] {
  const district = getDistrict(regionCode, districtName)
  return district?.schools ?? []
}

export function getSchool(regionCode: string, districtName: string, schoolExamNo: string): School | undefined {
  const schools = getSchools(regionCode, districtName)
  return schools.find((s) => s.examNo === schoolExamNo)
}

export function getRegionSummaries(regionCode: string): SummaryPdf[] {
  const region = getRegionByCode(regionCode)
  return region?.summaryPdfs ?? []
}

export function getDistrictSummaries(regionCode: string, districtName: string): SummaryPdf[] {
  const region = getRegionByCode(regionCode)
  if (!region) return []
  const key = Object.keys(region.districtSummaries).find(
    (k) => k.toLowerCase().replace(/\s+/g, "_") === districtName.toLowerCase()
  )
  return key ? region.districtSummaries[key] ?? [] : []
}
