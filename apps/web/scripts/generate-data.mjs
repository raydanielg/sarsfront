import { readdirSync, statSync, existsSync } from "fs"
import { join, basename } from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const regionsRoot = join(__dirname, "..", "public", "regions")
const outputFile = join(__dirname, "..", "lib", "regions-data.json")

function listPdfsWithin(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith(".pdf"))
    .map((f) => f)
}

function parseSchoolFileName(fileName) {
  // Pattern: "PS1308001 - AZIMIO PRIMARY SCHOOL.pdf"
  // or "ps1308036 - KAMISA PRIMARY SCHOOL.pdf"
  // or "PS1308034` - KAKOBE PRIMARY SCHOOL.pdf"
  const base = fileName.replace(/\.pdf$/i, "")
  const match = base.match(/^([A-Za-z]{2}\d+)\s*[-`]\s*(.+)$/)
  if (match) {
    return { examNo: match[1].toUpperCase(), name: match[2].trim() }
  }
  // Fallback: just use the whole name
  return { examNo: "", name: base.trim() }
}

function isSummaryFolder(folderName) {
  const upper = folderName.toUpperCase()
  return upper.includes("SUMMARY") || upper.includes("SUMMMERY")
}

function generateData() {
  const regions = []

  const regionFolders = readdirSync(regionsRoot).filter((f) => {
    const stat = statSync(join(regionsRoot, f))
    return stat.isDirectory()
  })

  for (const regionFolder of regionFolders) {
    const regionPath = join(regionsRoot, regionFolder)
    // Extract region name: "MWANZA REGION" -> "MWANZA"
    const regionName = regionFolder.replace(/\s+REGION/i, "").trim()

    const allItems = readdirSync(regionPath).filter((f) => {
      return statSync(join(regionPath, f)).isDirectory()
    })

    const districtFolders = allItems.filter((f) => !isSummaryFolder(f))
    const summaryFolders = allItems.filter((f) => isSummaryFolder(f))

    const districts = []
    for (const districtFolder of districtFolders) {
      const districtPath = join(regionPath, districtFolder)
      // Clean district name: "BUCHOSA 7" -> "BUCHOSA", "SHINYANGA DC 7" -> "SHINYANGA DC"
      const districtName = districtFolder.replace(/\s+7$/i, "").trim()

      const pdfFiles = listPdfsWithin(districtPath)
      const schools = pdfFiles
        .map((f) => {
          const parsed = parseSchoolFileName(f)
          const relativePath = `/regions/${regionFolder}/${districtFolder}/${f}`
          return {
            name: parsed.name,
            examNo: parsed.examNo,
            pdfPath: relativePath,
            fileName: f,
          }
        })
        .sort((a, b) => a.name.localeCompare(b.name))

      districts.push({
        name: districtName,
        folderName: districtFolder,
        schools,
        schoolCount: schools.length,
      })
    }

    // Collect summary PDFs
    let summaryPdfs = []
    for (const sf of summaryFolders) {
      const sfPath = join(regionPath, sf)
      const pdfs = listPdfsWithin(sfPath)
      for (const pdf of pdfs) {
        const relativePath = `/regions/${regionFolder}/${sf}/${pdf}`
        const baseName = pdf.replace(/\.pdf$/i, "")
        summaryPdfs.push({
          name: baseName,
          pdfPath: relativePath,
          fileName: pdf,
        })
      }
    }

    // Group summary PDFs by district name prefix
    const districtSummaries = {}
    for (const pdf of summaryPdfs) {
      // Try to match district name from the summary PDF name
      // e.g. "BUCHOSA DC MPANGILIO WA UFAULU KATA KIMADARAJA"
      const matchedDistrict = districts.find((d) => {
        const dn = d.name.toUpperCase()
        return pdf.name.toUpperCase().startsWith(dn)
      })
      if (matchedDistrict) {
        const key = matchedDistrict.name
        if (!districtSummaries[key]) districtSummaries[key] = []
        districtSummaries[key].push(pdf)
      } else {
        // Region-level summary
        if (!districtSummaries["_region"]) districtSummaries["_region"] = []
        districtSummaries["_region"].push(pdf)
      }
    }

    regions.push({
      name: regionName,
      folderName: regionFolder,
      districts,
      summaryPdfs,
      districtSummaries,
    })
  }

  return { regions }
}

const data = generateData()
const json = JSON.stringify(data, null, 2)

import { writeFileSync } from "fs"
writeFileSync(outputFile, json, "utf-8")
console.log(`Generated ${outputFile}`)
console.log(`Regions: ${data.regions.length}`)
for (const r of data.regions) {
  console.log(`  ${r.name}: ${r.districts.length} districts, ${r.summaryPdfs.length} summary PDFs`)
  for (const d of r.districts) {
    console.log(`    ${d.name}: ${d.schoolCount} schools`)
  }
}
