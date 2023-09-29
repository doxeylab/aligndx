'use client'

import DenseLayout from '@/layouts/dense'
import { ReactNode } from 'react'

type Props = {
    children: ReactNode
}

export default function ActivateLayout({ children }: Props) {
    return <DenseLayout>{children}</DenseLayout>
}
