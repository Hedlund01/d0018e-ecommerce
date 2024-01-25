"use client"
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';


import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';



export default function Dashboard() {


    return (
        <>

            <Box
                sx={{
                    display: 'flex',
                    mb: 1,
                    gap: 1,
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'start', sm: 'center' },
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                }}
            >
                <Typography level="h2" component="h1">
                    Orders
                </Typography>
                <Button
                    color="primary"
                    startDecorator={<DownloadRoundedIcon />}
                    size="sm"
                >
                    Download PDF
                </Button>
            </Box>

        </>

    );
}