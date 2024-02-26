"use client"
import { getOrderLines } from "@/actions/orderLines";
import { getOrdersByUserId } from "@/actions/orders";
import { getProduct } from "@/actions/products";
import { OrderLine } from "@/types/order_line";
import { Order } from "@/types/orders";
import { Product } from "@/types/products";
import { Accordion, AccordionDetails, AccordionGroup, AccordionSummary, Divider, Sheet, Stack, Typography, accordionClasses } from "@mui/joy";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { numericFormatter } from "react-number-format";
import OrderProductCard from "./components/orderProductCard";

function Row(props: {
    order: Order;
    initialOpen?: boolean;
}) {
    const [open, setOpen] = useState(props.initialOpen || false);
    const [orderLines, setOrderLines] = useState<OrderLine[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const { order } = props;

    useEffect(() => {
        if (open && orderLines.length === 0 && products.length === 0) {
            getOrderLines(props.order.id.toString()).then((orderLines) => {
                setOrderLines(orderLines)
                orderLines.forEach((orderLine) => {
                    getProduct(orderLine.productid.toString()).then((product) => {
                        if (product !== undefined) {
                            setProducts([...products, product])
                        }
                    })
                })
            })
        }
    }, [open])

    return (
        <>
            <Accordion
                expanded={open}
                onChange={() => setOpen(!open)}
            >
                <AccordionSummary>
                    <Stack direction={
                        {
                            xs: "column",
                            sm: "row"
                        }

                    } spacing={2} divider={<Divider orientation="vertical" />}>
                        <Typography level="h3">Order {order.id}</Typography>
                        <Typography level="h4">Placed: {order.createdAt.toLocaleDateString()}</Typography>
                        <Typography level="h4">Total: {numericFormatter(order.totalPrice.toString(), {
                            suffix: " SEK",
                            thousandSeparator: " ",
                        })}</Typography>
                        <Typography level="h4">Status: {order.status}</Typography>

                    </Stack>
                </AccordionSummary>
                <AccordionDetails>
                    <Stack direction="row" spacing={2}>
                        {
                            products.map((product, index) => (
                                <OrderProductCard key={index} product={product} />
                            ))
                        }
                    </Stack>
                </AccordionDetails>
            </Accordion>
        </>
    )
}

export default function Page() {

    const { data: session, status } = useSession();
    const [orders, setOrders] = useState<Order[]>([])

    if (status === "loading") return null
    if (status === "unauthenticated") redirect("/auth/signin")

    useEffect(() => {
        getOrdersByUserId(Number(session?.user.id)).then((orders) => {
            setOrders(orders)
        })
    }, [session?.user.id])

    return (
        <>
            <Typography level="h1" mb={2}>Orders</Typography>
            <Sheet variant="soft" sx={{ padding: "2rem" }}>
                <AccordionGroup size="lg"
                    sx={{
                        [`& .${accordionClasses.root}`]: {
                            marginTop: '0.5rem',
                            transition: '0.2s ease',
                            '& button:not([aria-expanded="true"])': {
                                transition: '0.2s ease',
                                paddingBottom: '0.625rem',
                            },
                            '& button:hover': {
                                background: 'transparent',
                            },
                        },
                        [`& .${accordionClasses.root}.${accordionClasses.expanded}`]: {
                            bgcolor: 'background.level1',
                            borderRadius: 'md',
                            borderBottom: '1px solid',
                            borderColor: 'background.level2',
                        },
                        '& [aria-expanded="true"]': {
                            boxShadow: (theme) => `inset 0 -1px 0 ${theme.vars.palette.divider}`,
                        },
                    }}
                >
                    {
                        orders.map((order) => (
                            <Row key={order.id} order={order} />
                        ))
                    }

                </AccordionGroup>
            </Sheet>
        </>
    )

}