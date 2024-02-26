"use client"
import ColorSchemeToggle from "@/components/ColorSchemeToggle";
import Logo from "@/components/Logo";
import { Box } from "@mui/joy";

export default function Header() {
    return (
         <Box
                        component="header"
                        sx={{
                            display: 'flex',
                            alignItems: 'left',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Logo />
                        <ColorSchemeToggle />
                    </Box>
    )
}