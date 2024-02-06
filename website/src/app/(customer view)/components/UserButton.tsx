import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import { Avatar, Box, Dropdown, IconButton, ListDivider, Menu, MenuButton, MenuItem, Typography } from "@mui/joy";

export function UserButton() {
    return (
        <Dropdown>
            <MenuButton
                variant="plain"
                size="sm"
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                
            >
                <Avatar
                    src="https://i.pravatar.cc/40?img=2"
                    sx={{ maxWidth: '32px', maxHeight: '32px' }}
                />
                <Typography sx={{ display: { xs: 'flex', sm: 'none' }, }}>
                    User
                </Typography>
            </MenuButton>
            <Menu
                size="sm"
                sx={{
                    zIndex: '99999',
                    p: 1,
                    gap: 1,
                    '--ListItem-radius': 'var(--joy-radius-sm)',
                }}
            >
                <MenuItem>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar
                            src="https://i.pravatar.cc/40?img=2"
                            srcSet="https://i.pravatar.cc/80?img=2"
                            sx={{ borderRadius: '50%' }}
                        />
                        <Box sx={{ ml: 1.5 }}>
                            <Typography level="title-sm" textColor="text.primary">
                                Rick Sanchez
                            </Typography>
                            <Typography level="body-xs" textColor="text.tertiary">
                                rick@email.com
                            </Typography>
                        </Box>
                    </Box>
                </MenuItem>
                <ListDivider />
                <MenuItem>
                    <HelpRoundedIcon />
                    Help
                </MenuItem>
                <MenuItem>
                    <SettingsRoundedIcon />
                    Settings
                </MenuItem>
                <ListDivider />
                <MenuItem component="a" href="/blog/first-look-at-joy/">
                    First look at Joy UI
                    <OpenInNewRoundedIcon />
                </MenuItem>
                <MenuItem
                    component="a"
                    href="https://github.com/mui/material-ui/tree/master/docs/data/joy/getting-started/templates/email"
                >
                    Sourcecode
                    <OpenInNewRoundedIcon />
                </MenuItem>
                <ListDivider />
                <MenuItem>
                    <LogoutRoundedIcon />
                    Log out
                </MenuItem>
            </Menu>
        </Dropdown>
    )
}