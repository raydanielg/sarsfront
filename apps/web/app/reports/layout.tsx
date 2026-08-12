import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reports — Regional Examination Results",
  description: "Takwimu na ripoti za matokeo ya mitihani kwa mikoa yote nchini Tanzania.",
}

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
