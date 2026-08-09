export type Region = {
  name: string
  code: string
}

export const regions: Region[] = [
  { name: "ARUSHA", code: "ps01" },
  { name: "DAR ES SALAAM", code: "ps02" },
  { name: "DODOMA", code: "ps03" },
  { name: "GEITA", code: "ps24" },
  { name: "IRINGA", code: "ps04" },
  { name: "KAGERA", code: "ps05" },
  { name: "KATAVI", code: "ps25" },
  { name: "KIGOMA", code: "ps06" },
  { name: "KILIMANJARO", code: "ps07" },
  { name: "LINDI", code: "ps08" },
  { name: "MANYARA", code: "ps21" },
  { name: "MARA", code: "ps09" },
  { name: "MBEYA", code: "ps10" },
  { name: "MOROGORO", code: "ps11" },
  { name: "MTWARA", code: "ps12" },
  { name: "MWANZA", code: "ps13" },
  { name: "NJOMBE", code: "ps26" },
  { name: "PWANI", code: "ps14" },
  { name: "RUKWA", code: "ps15" },
  { name: "RUVUMA", code: "ps16" },
  { name: "SHINYANGA", code: "ps17" },
  { name: "SIMIYU", code: "ps27" },
  { name: "SINGIDA", code: "ps18" },
  { name: "SONGWE", code: "ps31" },
  { name: "TABORA", code: "ps19" },
  { name: "TANGA", code: "ps20" },
]

export function getRegionByCode(code: string): Region | undefined {
  return regions.find((r) => r.code === code)
}

export type District = {
  name: string
  code: string
}

const districtData: Record<string, District[]> = {
  ps01: [
    { name: "ARUSHA MJENG", code: "ds01" },
    { name: "ARUMERU", code: "ds02" },
    { name: "KARATU", code: "ds03" },
    { name: "LONGIDO", code: "ds04" },
    { name: "MONDULI", code: "ds05" },
    { name: "NGORONGORO", code: "ds06" },
  ],
  ps02: [
    { name: "ILALA", code: "ds01" },
    { name: "KINONDONI", code: "ds02" },
    { name: "TEMEKE", code: "ds03" },
    { name: "UBUNGO", code: "ds04" },
    { name: "KIGAMBONI", code: "ds05" },
  ],
  ps03: [
    { name: "DODOMA MJINI", code: "ds01" },
    { name: "BAHI", code: "ds02" },
    { name: "CHAMWINO", code: "ds03" },
    { name: "CHEMBA", code: "ds04" },
    { name: "CONDOA", code: "ds05" },
    { name: "KONDOA", code: "ds06" },
    { name: "KONGWA", code: "ds07" },
  ],
  ps04: [
    { name: "IRINGA MJINI", code: "ds01" },
    { name: "KILolo", code: "ds02" },
    { name: "MAHENGE", code: "ds03" },
  ],
  ps05: [
    { name: "BUKOBA MJINI", code: "ds01" },
    { name: "BUKOBA VIJIJINI", code: "ds02" },
    { name: "MULEBA", code: "ds03" },
    { name: "NGARA", code: "ds04" },
    { name: "KARAGWE", code: "ds05" },
    { name: "KYERWA", code: "ds06" },
    { name: "MISSENYE", code: "ds07" },
  ],
  ps06: [
    { name: "KIGOMA MJINI", code: "ds01" },
    { name: "KASULU", code: "ds02" },
    { name: "KIBONDO", code: "ds03" },
    { name: "KAKONKO", code: "ds04" },
    { name: "UVINZA", code: "ds05" },
  ],
  ps07: [
    { name: "MOSHI MJINI", code: "ds01" },
    { name: "MOSHI VIJIJINI", code: "ds02" },
    { name: "HAI", code: "ds03" },
    { name: "ROMBO", code: "ds04" },
    { name: "SAME", code: "ds05" },
    { name: "MWANGA", code: "ds06" },
    { name: "SIHA", code: "ds07" },
  ],
  ps08: [
    { name: "LINDI MJINI", code: "ds01" },
    { name: "LINDI VIJIJINI", code: "ds02" },
    { name: "KILOSA", code: "ds03" },
    { name: "MTWARA MJINI", code: "ds04" },
    { name: "MTWARA VIJIJINI", code: "ds05" },
    { name: "RUANGWA", code: "ds06" },
  ],
  ps09: [
    { name: "MUSOMA MJINI", code: "ds01" },
    { name: "MUSOMA VIJIJINI", code: "ds02" },
    { name: "BUNDA", code: "ds03" },
    { name: "SERENGETI", code: "ds04" },
    { name: "TARIME", code: "ds05" },
    { name: "BUTIAMA", code: "ds06" },
  ],
  ps10: [
    { name: "MBEYA MJINI", code: "ds01" },
    { name: "MBEYA VIJIJINI", code: "ds02" },
    { name: "CHUNYA", code: "ds03" },
    { name: "MBOZI", code: "ds04" },
    { name: "RUNGWE", code: "ds05" },
    { name: "KYELA", code: "ds06" },
    { name: "ILEJE", code: "ds07" },
  ],
  ps11: [
    { name: "MOROGORO MJINI", code: "ds01" },
    { name: "MOROGORO VIJIJINI", code: "ds02" },
    { name: "KILOSA", code: "ds03" },
    { name: "KILOMBERO", code: "ds04" },
    { name: "UVINZA", code: "ds05" },
    { name: "MAHENO", code: "ds06" },
  ],
  ps12: [
    { name: "MTWARA MJINI", code: "ds01" },
    { name: "MTWARA VIJIJINI", code: "ds02" },
    { name: "MASASI", code: "ds03" },
    { name: "NEWALA", code: "ds04" },
    { name: "TANDAHIMBA", code: "ds05" },
    { name: "NANYUMBA", code: "ds06" },
  ],
  ps13: [
    { name: "MWANZA MJINI", code: "ds01" },
    { name: "MWANZA VIJIJINI", code: "ds02" },
    { name: "GEITA", code: "ds03" },
    { name: "SENGEREMA", code: "ds04" },
    { name: "UKEREWE", code: "ds05" },
    { name: "KWIMBA", code: "ds06" },
    { name: "MAGU", code: "ds07" },
  ],
  ps14: [
    { name: "KIBAHA", code: "ds01" },
    { name: "BAGAMOYO", code: "ds02" },
    { name: "KISARAWE", code: "ds03" },
    { name: "MKURANGA", code: "ds04" },
    { name: "RUFIJI", code: "ds05" },
    { name: "CHAMBEZI", code: "ds06" },
  ],
  ps15: [
    { name: "SUMBAWANGA", code: "ds01" },
    { name: "NKASI", code: "ds02" },
    { name: "MPANDA", code: "ds03" },
  ],
  ps16: [
    { name: "SONGEA MJINI", code: "ds01" },
    { name: "SONGEA VIJIJINI", code: "ds02" },
    { name: "TUNDURU", code: "ds03" },
    { name: "NAMTUMBO", code: "ds04" },
    { name: "NYASA", code: "ds05" },
  ],
  ps17: [
    { name: "SHINYANGA MJINI", code: "ds01" },
    { name: "SHINYANGA VIJIJINI", code: "ds02" },
    { name: "KAHAMA", code: "ds03" },
    { name: "BUKOMBE", code: "ds04" },
  ],
  ps18: [
    { name: "SINGIDA MJINI", code: "ds01" },
    { name: "SINGIDA VIJIJINI", code: "ds02" },
    { name: "MANYONI", code: "ds03" },
    { name: "IKUNGI", code: "ds04" },
    { name: "ITUNGI", code: "ds05" },
  ],
  ps19: [
    { name: "TABORA MJINI", code: "ds01" },
    { name: "TABORA VIJIJINI", code: "ds02" },
    { name: "NZEGA", code: "ds03" },
    { name: "SIKONGE", code: "ds04" },
    { name: "UGANDA", code: "ds05" },
  ],
  ps20: [
    { name: "TANGA MJINI", code: "ds01" },
    { name: "TANGA VIJIJINI", code: "ds02" },
    { name: "KOROGWE", code: "ds03" },
    { name: "MUHEZA", code: "ds04" },
    { name: "PANGANI", code: "ds05" },
    { name: "HANDENI", code: "ds06" },
    { name: "KILINDI", code: "ds07" },
    { name: "MHEDE", code: "ds08" },
  ],
  ps21: [
    { name: "BABATI", code: "ds01" },
    { name: "HANANG", code: "ds02" },
    { name: "MANYARA", code: "ds03" },
    { name: "SIMANJIRO", code: "ds04" },
    { name: "KITETO", code: "ds05" },
  ],
  ps24: [
    { name: "GEITA MJINI", code: "ds01" },
    { name: "GEITA VIJIJINI", code: "ds02" },
    { name: "BUKOMBE", code: "ds03" },
    { name: "CHATO", code: "ds04" },
  ],
  ps25: [
    { name: "MPANDA MJINI", code: "ds01" },
    { name: "MPANDA VIJIJINI", code: "ds02" },
    { name: "NKASI", code: "ds03" },
  ],
  ps26: [
    { name: "NJOMBE MJINI", code: "ds01" },
    { name: "NJOMBE VIJIJINI", code: "ds02" },
    { name: "WANGING'OMBE", code: "ds03" },
    { name: "MAKETE", code: "ds04" },
    { name: "LUDEWA", code: "ds05" },
  ],
  ps27: [
    { name: "BARIADI", code: "ds01" },
    { name: "MEATU", code: "ds02" },
    { name: "ITILIMA", code: "ds03" },
  ],
  ps31: [
    { name: "MBEYA MJINI", code: "ds01" },
    { name: "MBOZI", code: "ds02" },
    { name: "ISEKE", code: "ds03" },
  ],
}

export function getDistricts(regionCode: string): District[] {
  return districtData[regionCode] ?? []
}

export type School = {
  name: string
  code: string
  examNo: string
}

const schoolNames = [
  "KWARAA SECONDARY SCHOOL", "MWANZA SECONDARY SCHOOL", "AZANIA SECONDARY SCHOOL",
  "TABORA BOYS SECONDARY SCHOOL", "ILBORU SECONDARY SCHOOL", "KIBAHA SECONDARY SCHOOL",
  "MZUMBE SECONDARY SCHOOL", "KILAKALA SECONDARY SCHOOL", "IFUNDA SECONDARY SCHOOL",
  "LUGALO SECONDARY SCHOOL", "MARIAN GIRLS SECONDARY SCHOOL", "JANGWANI SECONDARY SCHOOL",
  "ZANAKI SECONDARY SCHOOL", "BENJAMIN MKAPA SECONDARY SCHOOL", "KISIMIRI SECONDARY SCHOOL",
  "MAJENGO SECONDARY SCHOOL", "MSASANI SECONDARY SCHOOL", "OYSTERBAY SECONDARY SCHOOL",
  "KUNDAMTUGUMU SECONDARY SCHOOL", "BAGAMOYO SECONDARY SCHOOL",
]

export function getSchools(regionCode: string, districtCode: string): School[] {
  const seed = (regionCode.charCodeAt(2) || 1) + (districtCode.charCodeAt(2) || 1)
  const count = ((seed * 3) % 8) + 4
  const schools: School[] = []
  for (let i = 0; i < count; i++) {
    const name = schoolNames[(seed + i * 5) % schoolNames.length] ?? "SECONDARY SCHOOL"
    const examNo = `S${String((seed * 137 + i * 911) % 9000 + 1000)}`
    schools.push({
      name,
      code: `sc${String(i + 1).padStart(2, "0")}`,
      examNo,
    })
  }
  return schools
}
