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
  // or "PS 1302249 - RIPEN PRIMARY SCHOOL.pdf" (space between PS and number)
  // or "PS.1302035 - IBINDO PRIMARY SCHOOL.pdf" (dot between PS and number)
  // or "PS_1305132 - NYABUHELE PRIMARY SCHOOL.pdf" (underscore between PS and number)
  // or "PS130202J9 - GATULI PRIMARY SCHOOL.pdf" (letter mixed in number)
  // or "1 - BUBUNGU PRIMARY SCHOOL.pdf" (plain number, no PS prefix)
  const base = fileName.replace(/\.pdf$/i, "")

  // Skip non-school files (too short, no dash, etc.)
  if (base.length < 5 || !base.includes("-")) {
    return null
  }

  // Try PS prefix pattern with optional separator
  let match = base.match(/^([A-Za-z]{2})[\s._]?\s*([A-Za-z0-9]+)\s*[-`]\s*(.+)$/)
  if (match) {
    return { examNo: (match[1] + match[2]).toUpperCase(), name: match[3].trim() }
  }

  // Try plain number pattern: "1 - BUBUNGU PRIMARY SCHOOL"
  match = base.match(/^(\d+)\s*[-`]\s*(.+)$/)
  if (match) {
    return { examNo: match[1], name: match[2].trim() }
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
          if (!parsed) return null
          const relativePath = `/regions/${regionFolder}/${districtFolder}/${f}`
          return {
            name: parsed.name,
            examNo: parsed.examNo,
            pdfPath: relativePath,
            fileName: f,
          }
        })
        .filter((s) => s !== null)
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
