import React, { forwardRef } from 'react'
import Box, { BoxProps } from '@mui/material/Box'

const Logo = forwardRef<HTMLDivElement, BoxProps>(({ sx, ...props }, ref) => {
    return (
        <Box
            component="img"
            src="/logo/logo_full.svg"
            sx={{ width: 60, height: 60, cursor: 'pointer', ...sx }}
            ref={ref}
            {...props}
        />
    )
})

Logo.displayName = 'Logo'

export default Logo
