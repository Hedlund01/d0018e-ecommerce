import { Box } from "@mui/joy";
import CheckoutCart from "./components/checkoutCart";
import CheckoutForm from "./components/checkoutForm";
import Footer from "./components/footer";
import Header from "./components/header";

export default function Page() {
    return (
        <>
            <Box sx={{
                height: '100vh',
                display: 'grid',
                gridTemplateRows: {
                    xs: 'auto auto 1fr auto',
                    md: 'auto 1fr auto',
                },
                gridTemplateAreas: {
                    xs: `
                        "header"
                        "aside"
                        "main"
                        "footer"
                    `,
                    md: `
                        "aside header"
                        "aside main"
                        "aside footer"
                    `,
                },
            }}>
                <Box sx={{ gridArea: 'header', m: 3 }}><Header /></Box>
                <Box sx={{ gridArea: 'aside', m: 3 }}><CheckoutCart /></Box>
                <Box sx={{ gridArea: 'main', m: 3 }}><CheckoutForm /></Box>
                <Box sx={{ gridArea: 'footer', flexShrink: 0 }}><Footer /></Box>
            </Box>
        </>
    )
}