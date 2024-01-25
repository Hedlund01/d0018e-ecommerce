import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Box } from "@mui/joy";
import { redirect } from "next/navigation";

import Breadcrumbs from "@/components/DashboardBreadcrumbs";
import { auth } from "@/utils/auth";

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {

    const session = await auth();
    if (session?.user.role !== "admin") {
        redirect("/auth/signin")
    }
    return (

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
    )
}