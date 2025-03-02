"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent rendering the theme-related content on the server
    if (!mounted) {
        return null;
    }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
