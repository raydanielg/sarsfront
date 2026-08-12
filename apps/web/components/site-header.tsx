"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { IconMoon, IconSun, IconMenu2, IconX, IconChartBar } from "@tabler/icons-react"

import { Button } from "@workspace/ui/components/button"
import { toast } from "@workspace/ui/components/toast"

import Image from "next/image"

export function SiteHeader() {
  const { resolvedTheme, setTheme } = useTheme()
  const [menuOpen, setMenuOpen] = React.useState(false)

  const toggleTheme = () => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 300)),
      {
        loading: "Inabadilisha theme...",
        success: newTheme === "dark" ? "Dark mode imewashwa" : "Light mode imewashwa",
        error: "Imeshindwa kubadilisha theme",
      }
    )
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-2.5 px-4 sm:px-6 lg:px-8">
          <Image
            src="/leanring.png"
            alt="Logo"
            width={32}
            height={32}
            className="size-8 shrink-0 rounded-lg object-contain"
          />
          <span className="font-heading text-base font-semibold tracking-tight">
            Regional Examination Results
          </span>

          {/* Desktop nav */}
          <nav className="ml-auto hidden items-center gap-1 sm:flex">
            <Link
              href="/"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Home
            </Link>
            <Link
              href="/reports"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Reports
            </Link>
          </nav>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto size-9 sm:ml-2"
            onClick={toggleTheme}
          >
            <IconSun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <IconMoon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="size-9 sm:hidden"
            onClick={() => setMenuOpen(true)}
          >
            <IconMenu2 className="size-5" />
            <span className="sr-only">Fungua menu</span>
          </Button>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] sm:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-full w-64 flex-col bg-background shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-border/60 px-4">
              <span className="font-heading text-sm font-semibold">Menu</span>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => setMenuOpen(false)}
              >
                <IconX className="size-5" />
              </Button>
            </div>
            <nav className="flex flex-col gap-1 p-3">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <IconChartBar className="size-4 text-muted-foreground" />
                Home
              </Link>
              <Link
                href="/reports"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <IconChartBar className="size-4 text-muted-foreground" />
                Reports
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
