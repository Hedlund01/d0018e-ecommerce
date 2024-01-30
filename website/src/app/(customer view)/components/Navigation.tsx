import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { Popper } from '@mui/base/Popper';
import Apps from '@mui/icons-material/Apps';
import FactCheck from '@mui/icons-material/FactCheck';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Person from '@mui/icons-material/Person';
import { Avatar, Box, Dropdown, ListDivider, Menu, MenuButton, MenuItem, Stack, Typography, useTheme } from '@mui/joy';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import { useMediaQuery } from '@mui/material';
import * as React from 'react';
import { useState } from 'react';



function AboutMenu() {
    const [anchorEl, setAnchorEl] = React.useState<HTMLAnchorElement | null>(null);


    const open = Boolean(anchorEl);
    const id = open ? 'about-popper' : undefined;
    return (
        <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
            <div onMouseLeave={() => setAnchorEl(null)}>
                <ListItemButton
                    aria-haspopup
                    aria-expanded={open ? 'true' : 'false'}
                    role="menuitem"

                    onFocus={(event) => setAnchorEl(event.currentTarget)}
                    onMouseEnter={(event) => {
                        setAnchorEl(event.currentTarget);
                    }}

                >
                    About <KeyboardArrowDown />
                </ListItemButton>
                <Popper id={id} open={open} anchorEl={anchorEl} disablePortal keepMounted>
                    <List
                        role="menu"
                        aria-label="About"
                        variant="outlined"
                        sx={{
                            my: 2,
                            boxShadow: 'md',
                            borderRadius: 'sm',
                            '--List-radius': '8px',
                            '--List-padding': '4px',
                            '--ListDivider-gap': '4px',
                            '--ListItemDecorator-size': '32px',
                            backgroundColor: 'white'

                        }}
                    >
                        <ListItem role="none">
                            <ListItemButton role="menuitem" >
                                <ListItemDecorator>
                                    <Apps />
                                </ListItemDecorator>
                                Overview
                            </ListItemButton>
                        </ListItem>
                        <ListItem role="none">
                            <ListItemButton role="menuitem">
                                <ListItemDecorator>
                                    <Person />
                                </ListItemDecorator>
                                Administration
                            </ListItemButton>
                        </ListItem>
                        <ListItem role="none">
                            <ListItemButton role="menuitem" >
                                <ListItemDecorator>
                                    <FactCheck />
                                </ListItemDecorator>
                                Facts
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Popper>
            </div>
        </ClickAwayListener>
    );
}


function AdmissionsMenu() {
    const [open, setOpen] = useState(false);
    return (
        <>
            <ListItemButton onClick={() => setOpen(true)}  >

            </ListItemButton>

        </>
    );
}

export default function Navigation() {
    const theme = useTheme();
    const xs = useMediaQuery(theme.breakpoints.down('sm'));
    const [anchorEl, setAnchorEl] = React.useState<HTMLAnchorElement | null>(null);
    const open = Boolean(anchorEl);

    return (
        <Stack direction={xs ? 'column' : 'row'} gap={2}>
            <Dropdown>
                <MenuButton
                    size="lg"
                    endDecorator={<KeyboardArrowDown />}
                >
                   Test
                </MenuButton>
                <Menu
                    sx={{
                        zIndex: '99999',
                        p: 1,
                        gap: 1,
                        '--ListItem-radius': 'var(--joy-radius-sm)',
                    }}
                >

                    <MenuItem>
                        Help
                    </MenuItem>
                    <MenuItem>
                        Settings
                    </MenuItem>
                    <ListDivider />
                    <MenuItem component="a" href="/blog/first-look-at-joy/">
                        First look at Joy UI
                    </MenuItem>
                    <MenuItem
                        component="a"
                        href="https://github.com/mui/material-ui/tree/master/docs/data/joy/getting-started/templates/email"
                    >
                        Sourcecode
                    </MenuItem>
                    <ListDivider />
                    <MenuItem>
                        Log out
                    </MenuItem>
                </Menu>
            </Dropdown>
            <Dropdown>
                <MenuButton
                    variant="soft"
                    size="lg"
                >
                    Test
                </MenuButton>
                <Menu
                    placement="bottom"
                    size="sm"
                    sx={{
                        zIndex: '99999',
                        p: 1,
                        gap: 1,
                        '--ListItem-radius': 'var(--joy-radius-sm)',
                    }}
                >

                    <MenuItem>
                        Help
                    </MenuItem>
                    <MenuItem>
                        Settings
                    </MenuItem>
                    <ListDivider />
                    <MenuItem component="a" href="/blog/first-look-at-joy/">
                        First look at Joy UI
                    </MenuItem>
                    <MenuItem
                        component="a"
                        href="https://github.com/mui/material-ui/tree/master/docs/data/joy/getting-started/templates/email"
                    >
                        Sourcecode
                    </MenuItem>
                    <ListDivider />
                    <MenuItem>
                        Log out
                    </MenuItem>
                </Menu>
            </Dropdown>
        </Stack>
    );
}
