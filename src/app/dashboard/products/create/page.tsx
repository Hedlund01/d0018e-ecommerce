import { Sheet, Typography, Stack, Input, Button, FormControl, FormLabel } from "@mui/joy";
import { forwardRef } from "react";
import NumericFormatAdapter from "./NumericFormatAdapter";
import { CreateUpdateProduct, createUpdateProductSchema } from "@/types/products";
import { z } from "zod";
import { createProduct } from "@/actions/products";
import { redirect } from "next/navigation";

export default function Page() {
	async function handleCreateProduct(formData: FormData) {
        "use server";
        const rawFormData = Object.fromEntries(formData.entries())
        const unparsedProduct = {
            name: rawFormData.name,
            description: rawFormData.description,
            price: Number(rawFormData.price.toString().split(' SEK')[0].replace(" ", "")),
            image: rawFormData.image,
            quantity: Number(rawFormData.quantity),
            category: rawFormData.category
        } as CreateUpdateProduct
        const product = await createUpdateProductSchema.safeParseAsync(unparsedProduct)
        if(!product.success) {
            console.log(product.error)
            return
        }
		await createProduct(product.data)
        redirect("/dashboard/products")
        // console.log(product.data)
	}

	return (
		<>
			<Typography level="h1">Create Product</Typography>
			<Sheet
				variant="outlined"
				sx={{
					borderRadius: "sm",
					padding: "2rem",
				}}
			>
				<form action={handleCreateProduct}>
                    <Stack spacing={1}>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input name="name" type="text" required />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Description</FormLabel>
						<Input
							name="description"
							type="text"
							required
                            /></FormControl>
                        
                        <FormControl>
                            <FormLabel>Price</FormLabel>
                            <Input name="price" required
                                slotProps={{
                                    input: {
                                        component: NumericFormatAdapter
                                    }
                                }}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Category</FormLabel>
                            <Input

                                name="category"
                                type="text"
                                required
                            />
                        </FormControl>


                        <FormControl>
                            <FormLabel>Image</FormLabel>
                            <Input name="image" type="url" required />
                        </FormControl>
						
                        <FormControl>
                            <FormLabel>Quantity</FormLabel>
                            <Input
							
							name="quantity"
							type="number"
							required
						/>
                        </FormControl>
						<Button type="submit">Submit</Button>
					</Stack>
				</form>
			</Sheet>
		</>
	);
}
