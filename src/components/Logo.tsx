
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import { Box, IconButton, Typography } from "@mui/joy";
export default function Logo() {
    return (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <IconButton variant="soft" color="neutral" size="sm" >
                <CurrencyExchangeIcon />
            </IconButton>
            <Typography level="title-lg">Group 5 Co.</Typography>
        </Box>
    )
}