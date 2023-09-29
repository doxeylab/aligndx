'use client'
import React, { forwardRef } from 'react'
import Box, { BoxProps } from '@mui/material/Box'
import { routes } from '@/routes'
import { Link } from '@mui/material'

interface LogoProps extends BoxProps {
    disabled?: boolean
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
    ({ sx, disabled = false, ...props }, ref) => {
        const logo = (
            <Box
                component="img"
                src="/assets/logo/aligndx_logo_dark.svg"
                sx={{ width: 60, height: 60, cursor: 'pointer', ...sx }}
                ref={ref}
                {...props}
            />
        )
        if (disabled) {
            return logo
        }

        return (
            <Link href={routes.home} sx={{ display: 'contents' }}>
                {logo}
            </Link>
        )
    }
)

Logo.displayName = 'Logo'

export default Logo
