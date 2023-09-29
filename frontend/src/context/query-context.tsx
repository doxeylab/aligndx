'use client'

import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { useState, ReactNode } from 'react'

interface QueryProviderProps {
    children: ReactNode
}

const QueryProvider = ({ children }: QueryProviderProps) => {
    const [queryClient] = useState(() => new QueryClient())

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

export default QueryProvider
