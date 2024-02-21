import { checkout } from "@/actions/checkout";
import { useSnackBar } from "@/providers/alertProvider";
import { auth } from "@/utils/auth";
import { Button, Card, FormControl, FormLabel, Input, Sheet, Stack, Typography } from "@mui/joy";
import { redirect } from "next/navigation";
import { useState } from "react";

export default async function CheckoutForm() {
    let error = ""
    const session = await auth()
    if (!session) {
        redirect("auth/signin")
    }
    async function handleSubmit() {
        "use server"
        const res = await checkout();
        if (res.success) {
            redirect(`/orders/${res.id}`)
        } else {
            error = res.message
        }
        
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
                
                {
                    error && (
                        <Card variant="soft" color="danger" sx={{ mb: 3 }}>
                            {error}
                        </Card>
                    )
                }
            
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