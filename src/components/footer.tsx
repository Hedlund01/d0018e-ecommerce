import { Box, Typography } from "@mui/joy";

export default function Footer() {
    return (
          <Box component="footer" sx={{ py: 3 }}>
                        <Typography level="body-xs" textAlign="center">
                            © Group 5 Co.{new Date().getFullYear()}
                        </Typography>
                    </Box>
    )
}