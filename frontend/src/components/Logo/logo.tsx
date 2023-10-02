import React, { forwardRef } from 'react'
import Box, { BoxProps } from '@mui/material/Box'
import { Link } from '@mui/material'

interface LogoProps extends BoxProps {
    disabled?: boolean
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
    ({ sx, disabled = false, ...props }, ref) => {
        const logo = (
            <Box
                component="img"
                src="/assets/aligndx_logo_dark.svg"
                sx={{ width: 100, height: 100, cursor: 'pointer', ...sx }}
                ref={ref}
                {...props}
            />
        )
        if (disabled) {
            return logo
        }

        return (
            <Link href={'/'} sx={{ display: 'contents' }}>
                {logo}
            </Link>
        )
    }
)

Logo.displayName = 'Logo'

export default Logo
