import { Sheet, Typography, Stack, Input, Button, FormControl, FormLabel } from "@mui/joy";
import { forwardRef } from "react";
import { CreateUpdateProduct, createUpdateProductSchema } from "@/types/products";
import { z } from "zod";
import { createProduct, getProduct, updateProduct} from "@/actions/products";
import { redirect } from "next/navigation";
import NumericFormatAdapter from "../../create/NumericFormatAdapter";

export default async function Page({ params }: {
    params: {
        id: string;
    };
}) {

    const product = await getProduct(params.id);

	async function handleUpdateProduct(formData: FormData) {
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
		await updateProduct(params.id, product.data)
        redirect("/dashboard/products")
	}

	return (
		<>
			<Typography level="h1">Edit Product</Typography>
			<Sheet
				variant="outlined"
				sx={{
					borderRadius: "sm",
					padding: "2rem",
				}}
			>
				<form action={handleUpdateProduct}>
                    <Stack spacing={1}>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input name="name" type="text" required defaultValue={product?.name}/>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Description</FormLabel>
						<Input
							name="description"
							type="text"
                            defaultValue={product?.description}
							required
                            /></FormControl>
                        
                        <FormControl>
                            <FormLabel>Price</FormLabel>
                            <Input name="price" defaultValue={product?.price} required
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
                                defaultValue={product?.category}
                                required
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Image</FormLabel>
                            <Input name="image" type="url" defaultValue={product?.image} required />
                        </FormControl>
						
                        <FormControl>
                            <FormLabel>Quantity</FormLabel>
                            <Input
							
							name="quantity"
                                type="number"
                                defaultValue={product?.quantity}
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
