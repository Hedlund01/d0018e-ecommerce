"use client"

import { Sheet, Box, CircularProgress } from "@mui/joy"

export default function LoadingIndicator() {
    return (
        <Sheet sx={(theme) => ({

            backgroundColor: theme.vars.palette.background.level1

        })}>
            {/* Center the children */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100dvh' }}>
                <CircularProgress size="lg" />
            </Box>
        </Sheet>
    )
}