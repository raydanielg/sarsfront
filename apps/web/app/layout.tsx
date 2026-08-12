import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Inter } from "next/font/google"

import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@workspace/ui/components/toast"
import { cn } from "@workspace/ui/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Regional Examination Results",
  description: "Regional Examination Results — Search and view examination results by region, district, and school across Tanzania.",
  keywords: ["examination results", "Tanzania", "NECTA", "regional results", "school results", "SFNA"],
  authors: [{ name: "Regional Examination Results" }],
  icons: {
    icon: "/leanring.png",
    shortcut: "/leanring.png",
    apple: "/leanring.png",
  },
  openGraph: {
    title: "Regional Examination Results",
    description: "Search and view examination results by region, district, and school across Tanzania.",
    images: [{ url: "/gettyimages-1189483048-612x612.jpg", width: 612, height: 612, alt: "Regional Examination Results" }],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Regional Examination Results",
    description: "Search and view examination results by region, district, and school across Tanzania.",
    images: ["/gettyimages-1189483048-612x612.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
