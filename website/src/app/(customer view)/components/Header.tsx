"use client"
import Box from '@mui/joy/Box';
import DialogTitle from '@mui/joy/DialogTitle';
import Drawer from '@mui/joy/Drawer';
import ModalClose from '@mui/joy/ModalClose';
import Stack from '@mui/joy/Stack';


import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ColorSchemeToggle from '@/components/ColorSchemeToggle';
import Logo from '@/components/Logo';
import Navigation from './Navigation';
import { UserButton } from './UserButton';
import { Button, IconButton } from '@mui/joy';


export default function Header({ drawerOpen, setDrawerOpen }: { drawerOpen: boolean, setDrawerOpen: Function }) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexGrow: 1,
                justifyContent: 'space-between',
            }}
        >
            {/* Shown in header when larger display */}
            <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={4}
                sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
                <Logo />
                <Navigation />

                
            </Stack>

            {/* Shown in header on smaller displays */}
            <Box sx={{ display: { xs: 'inline-flex', sm: 'none' } }}>
                <Logo />
                <Drawer
                    sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                >
                    <ModalClose />
                    <DialogTitle><Logo /></DialogTitle>
                    <Box sx={{ px: 1, mt: 2 }}>
                        <Navigation />
                    </Box>
                </Drawer>
            </Box>


            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 1.5,
                    alignItems: 'center',
                }}
            >

                <ColorSchemeToggle />
                <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
                  <UserButton />
                </Box>
                <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
                    <IconButton>
                        <ShoppingCartIcon />
                    </IconButton>
                </Box>
           
            </Box>
        </Box>
    );
}