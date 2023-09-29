import DenseLayout from '@/layouts/dense/layout'
import { ReactNode } from 'react'

interface MarketingLayoutProps {
    children: ReactNode
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
    return <DenseLayout>{children}</DenseLayout>
}
