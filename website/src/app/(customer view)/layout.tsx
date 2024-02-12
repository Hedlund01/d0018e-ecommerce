"use client"
import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';
import * as React from 'react';

import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import { Box, IconButton, Sheet, useTheme } from '@mui/joy';
import Header from './components/Header';
import { UserButton } from './components/UserButton';
import { useCart } from '@/providers/CartProvider';

export default function Layout({ children }: { children: React.ReactNode }) {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const theme = useTheme();
    const cart = useCart();
    const breakpoint = theme.breakpoints.down('sm');
    const headerHeight = "8vh";
    const footerHeight = "8vh";
    return (
        <>
            
            <Stack
                id="tab-bar"
                direction="row"
                justifyContent="space-around"
                spacing={1}
                sx={(theme) => ({
                    display: { xs: 'flex', sm: 'none' },
                    zIndex: '999',
                    bottom: 0,
                    position: 'fixed',
                    width: '100dvw',
                    py: "1rem",
                    backgroundColor: theme.vars.palette.background.surface,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    height: footerHeight,
                })}
            >
                <IconButton sx={{ flexDirection: 'column', '--Button-gap': 0 }} onClick={() => setDrawerOpen(true)}>
                    <MenuRoundedIcon />
                    Menu
                </IconButton>
                <UserButton />

                <Button
                    variant="plain"
                    color="neutral"
                    startDecorator={<ShoppingCartIcon />}
                    sx={{ flexDirection: 'column', '--Button-gap': 0 }}
                    onClick={() => cart.showCart()}
                >
                    Cart
                </Button>
            </Stack>
            <Box
                sx={{


                    ...(drawerOpen && {
                        height: '100vh',
                        overflow: 'hidden',
                    }),
                }}
            >
                <Box
                    component="header"
                    className="Header"
                    sx={(theme) => (
                        {
                            p: 2,
                            gap: 2,
                            bgcolor: theme.vars.palette.background.surface,
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gridColumn: '1 / -1',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            position: 'sticky',
                            top: 0,
                            zIndex: 1100,
                            height: headerHeight,
                        })
                    }
                >

                    <Header setDrawerOpen={setDrawerOpen} drawerOpen={drawerOpen} />
                </Box>

                <Sheet sx={(theme) => ({
                    p: 2,
                    height: `calc(100vh - ${headerHeight})`,
                    [breakpoint]: {
                        height: `calc(100vh - ${headerHeight} -${footerHeight})`,
                    },
                    backgroundColor: theme.vars.palette.background.body
                })}>
                    {children}
                </Sheet>
            </Box >
        </>
    );
}