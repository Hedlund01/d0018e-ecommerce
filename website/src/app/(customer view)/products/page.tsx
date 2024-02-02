import { getProducts, getProductsCached } from "@/actions/products";
import { Product } from "@/types/products";
import { Box, Sheet } from "@mui/joy";
import ProductCard from "./components/ProductCard";
import { cache } from "react";

export const revalidate = 3600 // revalidate the data at most every hour

export default async function Page() {
    const products: Product[] = await getProductsCached();
    return (
        <>
            <h1>Products</h1>
            <Sheet
                variant="soft"
                sx={{
                    borderRadius: 'sm',
                    padding: '2rem',
                }}>
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gridAutoRows: '1fr',
                    gap: '1rem'

                }}>
                    {products.map((product) => {
                        return <ProductCard key={ product.id}  product={product} />
                    })}
                </Box>
            </Sheet>
        </>
    );
}