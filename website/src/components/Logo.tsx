import { Box, Typography, IconButton } from "@mui/joy";
import ColorSchemeToggle from "./ColorSchemeToggle";
import BrightnessAutoRoundedIcon from '@mui/icons-material/BrightnessAutoRounded';
export default function Logo( ) {
    return (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <IconButton variant="soft" color="primary" size="sm" >
                <BrightnessAutoRoundedIcon />
            </IconButton>
            <Typography level="title-lg">Acme Co.</Typography>
        </Box>
    )
}