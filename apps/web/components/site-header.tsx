"use client"

import { useTheme } from "next-themes"
import { IconMoon, IconSun } from "@tabler/icons-react"

import { Button } from "@workspace/ui/components/button"
import { toast } from "@workspace/ui/components/toast"

export function SiteHeader() {
  const { resolvedTheme, setTheme } = useTheme()

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
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <span className="font-heading text-base font-semibold tracking-tight">
          Result Management System
        </span>

        <Button
          variant="ghost"
          size="icon"
          className="ml-auto size-9"
          onClick={toggleTheme}
        >
          <IconSun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <IconMoon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  )
}
