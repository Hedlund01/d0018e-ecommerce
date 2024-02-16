import { checkout } from "@/actions/checkout";
import { auth } from "@/utils/auth";
import { Button, FormControl, FormLabel, Input, Sheet, Stack, Typography } from "@mui/joy";
import { redirect } from "next/navigation";

export default async function CheckoutForm() {
    const session = await auth()
    if (!session) {
        redirect("auth/signin")
    }
    async function handleSubmit() {
        "use server"
        await checkout();
        
    }
    return (
        <>
          <Typography level="h2" sx={{
                mb: 2
            
            }}>Checkout</Typography>
            <Sheet
                variant="soft"
                sx={{
                    borderRadius: 'sm',
                    padding: '2rem',
            }}>
          
            
            <form action={handleSubmit}>
                <Stack spacing={3}>

                  <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input name="name" type="text" required value={session.user.name || ""} disabled />
                </FormControl>
                 <FormControl>
                            <FormLabel>Email</FormLabel>
                            <Input name="email" type="email" required value={session.user.email || ""} disabled />
                        </FormControl>
                        <Button type="submit" variant="solid" color="primary">Checkout</Button>
                    </Stack>
            </form>
            </Sheet>
            </>
    )
}