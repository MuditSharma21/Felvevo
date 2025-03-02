"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React from "react"

const db = new QueryClient()

export default function ReactQueryProvider({
    children
}: {
    children: React.ReactNode
}) {
    return (
       <QueryClientProvider client={db}>
            { children }
       </QueryClientProvider>
    )
}