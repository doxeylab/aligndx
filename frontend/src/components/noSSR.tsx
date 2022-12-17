import dynamic from 'next/dynamic'
import { Fragment, ReactNode } from 'react'

interface NoSSRProps {
    children: ReactNode
}

const NoSsr = ({ children }: NoSSRProps) => (
    <Fragment>{children}</Fragment>
)

export default dynamic(() => Promise.resolve(NoSsr), {
    ssr: false
})