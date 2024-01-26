"use client"
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Box, Sheet } from "@mui/joy";
import { redirect, useRouter } from "next/navigation";

import Breadcrumbs from "@/components/DashboardBreadcrumbs";
import { auth } from "@/utils/auth";
import { useSession } from "next-auth/react";
import LoadingIndicator from "@/components/LoadingIndicator";
import { stat } from "fs";

export default  function Layout({
    children,
}: {
    children: React.ReactNode;
}) {

    const { data: session, status } = useSession();
    const router = useRouter();
    if (status === 'loading') return <LoadingIndicator />
    if (status === 'unauthenticated') router.push('/auth/signin')
    if(session?.user?.role !== 'admin') router.push('/')
   
    return (
        <Sheet sx={(theme) => ({

            backgroundColor: theme.vars.palette.background.level1

        })}>
            <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
                <Header />
                <Sidebar />

                <Box
                    component="main"
                    className="MainContent"
                    sx={{
                        px: { xs: 2, md: 6 },
                        pt: {
                            xs: 'calc(12px + var(--Header-height))',
                            sm: 'calc(12px + var(--Header-height))',
                            md: 3,
                        },
                        pb: { xs: 2, sm: 2, md: 3 },
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 0,
                        height: '100dvh',
                        gap: 1,
                    }}
                >
                    <Breadcrumbs />
                    {children}
                </Box>
            </Box>
        </Sheet>
    )
}