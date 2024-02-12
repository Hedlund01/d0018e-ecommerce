"use client"
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { Popper } from '@mui/base/Popper';
import Apps from '@mui/icons-material/Apps';
import FactCheck from '@mui/icons-material/FactCheck';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Person from '@mui/icons-material/Person';
import { Avatar, Box, Button, Dropdown, ListDivider, Menu, MenuButton, MenuItem, Stack, Typography, useTheme } from '@mui/joy';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import { useMediaQuery } from '@mui/material';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import * as React from 'react';
import { useState } from 'react';


export default function Navigation() {
    const theme = useTheme();
    const xs = useMediaQuery(theme.breakpoints.down('sm'));
    const [anchorEl, setAnchorEl] = React.useState<HTMLAnchorElement | null>(null);
    const open = Boolean(anchorEl);
    const { data: session, status } = useSession();

    return (
      <Stack direction={xs ? "column" : "row"} gap={2}>
        <Link href="/products">
          <Button size="lg" variant="outlined" color="neutral">
            Products
          </Button>
        </Link>
        {status === "authenticated" && session.user.role === "admin" && (
          <Link href="/dashboard">
            <Button size="lg" variant="outlined" color="neutral">
              Dashboard
            </Button>
          </Link>
        )}
      </Stack>
    );
}
