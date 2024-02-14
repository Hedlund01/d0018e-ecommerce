import {
    Sheet,
    Typography,
    Stack,
    Input,
    Button,
    FormControl,
    FormLabel,
} from "@mui/joy";
import NumericFormatAdapter from "./NumericFormatAdapter";
import { createNewOrderSchema } from "@/types/orders";
import { createOrder } from "@/actions/orders";
import { redirect } from "next/navigation";

export default function Page() {
    async function handleCreateOrder(formData: FormData) {
        "use server";
        const rawFormData = Object.fromEntries(formData.entries());
        console.log(rawFormData);
        const unparsedOrder = {
            userId: Number(rawFormData.userId),
            createdAt: new Date(),
            updatedAt: new Date(),
            status: rawFormData.status,
            totalPrice: 0,
            totalQuantity: 0,
        };
        const order = await createNewOrderSchema.safeParseAsync(unparsedOrder);
        if (!order.success) {
            console.log(order.error);
            return;
        }
        await createOrder(order.data);
        redirect("/dashboard/orders");
        // console.log(order.data)
    }

    return (
        <>
            <Typography level="h1">Create Order</Typography>
            <Sheet
                variant="outlined"
                sx={{
                    borderRadius: "sm",
                    padding: "2rem",
                }}
            >
                <form action={handleCreateOrder}>
                    <Stack spacing={1}>
                        <FormControl>
                            <FormLabel>User Id</FormLabel>
                            <Input name="userId" type="number" required />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Status</FormLabel>
                            <Input name="status" type="text" required />
                        </FormControl>
                        <Button type="submit">Submit</Button>
                    </Stack>
                </form>
            </Sheet>
        </>
    );
}
