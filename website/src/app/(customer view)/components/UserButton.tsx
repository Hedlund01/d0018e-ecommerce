"use client";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import {
  Avatar,
  Box,
  Button,
  Dropdown,
  IconButton,
  ListDivider,
  Menu,
  MenuButton,
  MenuItem,
  Stack,
  Typography,
} from "@mui/joy";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function UserButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Button
        variant="plain"
        size="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        disabled
      >
        <Avatar />
        <Typography sx={{ display: { xs: "flex", sm: "none" } }}>
          User
        </Typography>
      </Button>
    );
  }

  if (status === "unauthenticated") {
    return (
      <Link href="/auth/signin">
        <Button variant="soft">Login</Button>
      </Link>
    );
  }

  if (status === "authenticated") {
    return (
      <Dropdown>
        <MenuButton
          variant="plain"
          size="sm"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            src={session.user.image || ""}
            sx={{ maxWidth: "32px", maxHeight: "32px" }}
          >
            {session.user.name &&
              session.user.name?.split(" ")[0][0] +
                session.user.name?.split(" ")[1][0]}
          </Avatar>
          <Typography sx={{ display: { xs: "flex", sm: "none" } }}>
            User
          </Typography>
        </MenuButton>
        <Menu
          size="sm"
          sx={{
            zIndex: "99999",
            p: 1,
            gap: 1,
            "--ListItem-radius": "var(--joy-radius-sm)",
          }}
        >
          <MenuItem>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Avatar
                src={session.user.image || ""}
                sx={{ borderRadius: "50%" }}
              >
                {session.user.name &&
                  session.user.name?.split(" ")[0][0] +
                    session.user.name?.split(" ")[1][0]}
              </Avatar>
              <Box sx={{ ml: 1.5 }}>
                <Typography level="title-sm" textColor="text.primary">
                  {session.user.name || ""}
                </Typography>
                <Typography level="body-xs" textColor="text.tertiary">
                  {session.user.email || ""}
                </Typography>
              </Box>
            </Box>
          </MenuItem>
          <ListDivider />
          <MenuItem onClick={() => signOut()}>
            <LogoutRoundedIcon />
            Log out
          </MenuItem>
        </Menu>
      </Dropdown>
    );
  }
}
