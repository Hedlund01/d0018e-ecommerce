import { getCartDB } from "@/actions/cart";
import { Box, Divider, Sheet, Typography } from "@mui/joy";
import { redirect } from "next/navigation";
import { numericFormatter } from "react-number-format";
import CheckoutCartProducts from "./CheckoutCartProducts";
export default async function CheckoutCart() {
    const cart = await getCartDB();
    console.log(cart);
    if (cart.length === 0) {
        redirect("/")
    }
    return (
        <Sheet
            variant="soft"
            sx={{
                borderRadius: 'sm',
                padding: '2rem',
                height: '100%',

            }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
            }}>
                <Typography level="h3">Your Cart</Typography>
                <Typography level="h4" fontWeight="md">
                    {
                        cart.reduce((acc, cartLine) => {
                            return acc + cartLine.quantity
                        }, 0)
                    } Items
                </Typography>
            </Box>

            <Divider sx={{
                my: 3
            }} />


            <CheckoutCartProducts cart={cart} />


            <Box sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                mt: 3
            }}>
                <Typography level="h3" fontWeight="md">
                    Total: {numericFormatter(
                        cart.reduce((acc, cartLine) => {
                            return acc + cartLine.quantity * cartLine.product.price 
                        }, 0).toString(), {
                        thousandSeparator: ' ',
                        suffix: ' SEK',
                    })}
                </Typography>
            </Box>

        </Sheet >
    )
}