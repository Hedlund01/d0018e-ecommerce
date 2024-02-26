"use client";
import { getProduct } from "@/actions/products";
import LoadingIndicator from "@/components/LoadingIndicator";
import { useCart } from "@/providers/CartProvider";
import { Product } from "@/types/products";
import { Box, Button, Sheet, Typography } from "@mui/joy";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { numericFormatter } from "react-number-format";
import CreateProductReview from "./components/createProductReview";
import PreviousProductReviews from "./components/previousProductReviews";
import ProductRecommendations from "./components/productRecommendation";

export default function Page({ params }: { params: { id: number } }) {
  const { data: session, status } = useSession();
  const cart = useCart();

  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    getProduct(params.id.toString()).then((product) => {
      if (product === undefined) {
        redirect("/products");
      } else {
        setProduct(product);
      }
    });
  }, []);

  if (product === null) {
    return <LoadingIndicator />;
  }

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gap: "1rem",
          gridTemplateAreas: {
            md: `
            "Product Product Reviews RelatedProducts" 
            "Product Product Reviews RelatedProducts"
            "Product Product CreateReview RelatedProducts"
            
            `,
            xs: `
                "Product"
                "Reviews"
                "CreateReview"
                "RelatedProducts"
              `,
          },
          gridTemplateColumns: {
            md: "1fr 1fr 1fr 1fr",
            xs: "1fr",
          },
        }}
      >
        <Sheet
          variant="soft"
          sx={{
            borderRadius: "sm",
            padding: "2rem",
            gridArea: "Product",
          }}
        >
          <Typography level="h1">{product?.name}</Typography>
          <Image
            src={product.image}
            width={300}
            height={400}
            alt={product?.name || ""}
            priority
          />
          <Typography fontSize="lg" fontWeight="lg">
            {numericFormatter(product?.price ? product.price.toString() : "", {
              thousandSeparator: " ",
              suffix: " SEK",
            })}
          </Typography>
          <Typography level="h4">{product?.description}</Typography>

          <Button variant="soft" color="primary" onClick={() => cart.addToCart(product)}>
            Add to cart
          </Button>
        </Sheet>

        <Sheet
          variant="soft"
          sx={{
            borderRadius: "sm",
            padding: "2rem",
            gridArea: "Reviews",
          }}
        >
          <PreviousProductReviews productId={product.id} />


        </Sheet>

        <Box
          sx={{

            gridArea: "CreateReview",
          }}>

          <CreateProductReview productId={product.id} />
        </Box>
        <Sheet
          variant="soft"
          sx={{
            borderRadius: "sm",
            padding: "2rem",
            gridArea: "RelatedProducts",
          }}
        >
          <ProductRecommendations productCategory={product.category} excludeProductIds={[product.id]}/>
        </Sheet>
      </Box >
    </>
  );
}
