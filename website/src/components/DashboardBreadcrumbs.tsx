"use client"

import { Box, Typography, Breadcrumbs } from "@mui/joy"
import Link from "next/link"
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { usePathname } from "next/navigation";

export default function DashboardBreadcrumbs() {
    const pathname = usePathname();
    const path = pathname.split("/").filter((link) => link !== "dashboard");

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Breadcrumbs
                size="sm"
                aria-label="breadcrumbs"
                separator={<ChevronRightRoundedIcon />}
                sx={{ pl: 0 }}
            >

                {
                    path.map((link, index) => {
                        if (index === 0) {
                            return (
                                <Link
                                    key={link + index}
                                    href={link}
                                    aria-label="Home"
                                >
                                    <HomeRoundedIcon sx={{ m: 0, p: 0 }} />

                                </Link> 
                            )
                        } else {
                            return (
                                <Link
                                    key={link + index}
                                    href={link}
                                    style={{ textDecoration: 'none' }}
                                >
                                    {link}
                                </Link>
                            )
                        }
                    })
                }

            </Breadcrumbs>
        </Box>
    )
}