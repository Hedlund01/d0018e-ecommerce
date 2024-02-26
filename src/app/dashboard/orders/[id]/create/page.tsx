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
import { createOrderLine } from "@/actions/orderLines";
import { redirect } from "next/navigation";
import { getProduct } from "@/actions/products";
import { OrderLine, createUpdateOrderLineSchema } from "@/types/order_line";

export default function Page({
    params,
}: {
    params: {
        id: string;
    };
}) {
    async function handleCreateOrderLine(formData: FormData) {
        "use server";
        const rawFormData = Object.fromEntries(formData.entries());

        const product = await getProduct(rawFormData.productId.toString());
        if (!product) {
            console.log("Product not found");
            return;
        }

        console.log(params.id);
        const unparsedOrderLine = {
            orderid: Number(params.id),
            productid: Number(rawFormData.productId),
            price:
                Number(
                    product.price.toString().split(" SEK")[0].replace(" ", "")
                ) * Number(rawFormData.quantity),
            quantity: Number(rawFormData.quantity),
        } as OrderLine;
        const orderLine = await createUpdateOrderLineSchema.safeParseAsync(
            unparsedOrderLine
        );
        if (!orderLine.success) {
            console.log(orderLine.error);
            return;
        }
        await createOrderLine(orderLine.data);
        redirect("/dashboard/orders");
        // console.log(order.data)
    }

    return (
        <>
            <Typography level="h1">Create Order Line</Typography>
            <Sheet
                variant="outlined"
                sx={{
                    borderRadius: "sm",
                    padding: "2rem",
                }}
            >
                <form action={handleCreateOrderLine}>
                    <Stack spacing={1}>
                        <FormControl>
                            <FormLabel>Product Id</FormLabel>
                            <Input name="productId" type="number" required />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Quantity</FormLabel>
                            <Input name="quantity" type="number" required />
                        </FormControl>
                        <Button type="submit">Submit</Button>
                    </Stack>
                </form>
            </Sheet>
        </>
    );
}
