"use client";
import {
    Box,
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Modal,
    ModalClose,
    ModalDialog,
    Sheet,
    Typography,
} from "@mui/joy";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel,
    GridRowsProp,
    GridToolbar,
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    GridToolbarExport,
    GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import * as React from "react";
import { QueryResult, QueryResultRow } from "@vercel/postgres";
import { unCamelCase } from "@/utils/utils";
import Image from "next/image";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Delete, PrintDisabled } from "@mui/icons-material";
import { deleteOrder, getOrders } from "@/actions/orders";
import { Order, orderSchema } from "@/types/orders";
import { useState } from "react";

export default function Page() {
    const [orders, setOrders] = React.useState<Order[]>([]);
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
    const router = useRouter();
    React.useEffect(() => {
        const localAsync = async () => {
            const getOrdersResult = await getOrders();
            setOrders(getOrdersResult);
        };
        localAsync();
    }, []);

    const [rowSelectionModel, setRowSelectionModel] =
        useState<GridRowSelectionModel>([]);

    //Remove the field named emailVerified
    const rows: GridRowsProp = orders;
    const columns: GridColDef[] = Object.keys(orderSchema.keyof().Values).map(
        (key) => {
            if (key === "id") {
                return {
                    field: key,
                    headerName: unCamelCase(key),
                    width: 150,
                    renderCell: (params) => (
                        <Link href={`/dashboard/orders/${params.row.id}`}>
                            {params.row.id}
                        </Link>
                    ),
                };
            }
            return {
                field: key,
                headerName: unCamelCase(key),
                width: 150,
            };
        }
    );
    columns.push({
        field: "action",
        headerName: "Action",
        width: 150,
        renderCell: (params) => (
            <>
                <IconButton
                    onClick={() =>
                        router.push(`/dashboard/orders/edit/${params.row.id}`)
                    }
                >
                    <EditIcon />
                </IconButton>
            </>
        ),
    });

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <GridToolbarExport />
                <IconButton onClick={() => setOpenDeleteModal(true)}>
                    <Delete />
                </IconButton>
            </GridToolbarContainer>
        );
    }
    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    mb: 1,
                    gap: 1,
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "start", sm: "center" },
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                }}
            >
                <Typography level="h2" component="h1">
                    Orders
                </Typography>

                <Link href="/dashboard/orders/create">
                    <Button
                        color="primary"
                        startDecorator={<AddIcon />}
                        size="sm"
                    >
                        Add Order
                    </Button>
                </Link>
            </Box>
            <Sheet
                variant="outlined"
                sx={{
                    borderRadius: "sm",
                    padding: "2rem",
                }}
            >
                <DataGrid
                    rows={rows}
                    columns={columns}
                    slots={{
                        toolbar: CustomToolbar,
                    }}
                    checkboxSelection
                    disableRowSelectionOnClick
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                        setRowSelectionModel(newRowSelectionModel);
                    }}
                    rowSelectionModel={rowSelectionModel}
                />
            </Sheet>
            {openDeleteModal && (
                <Modal
                    open={openDeleteModal}
                    onClose={() => setOpenDeleteModal(false)}
                >
                    <ModalDialog variant="outlined" role="alertdialog">
                        <DialogTitle>Confirmation</DialogTitle>
                        <Divider />
                        <DialogContent>
                            Are you sure you want to delete these orders?
                        </DialogContent>
                        <DialogActions>
                            <Button
                                variant="solid"
                                color="danger"
                                onClick={async () => {
                                    rowSelectionModel.forEach(async (id) => {
                                        await deleteOrder(id.toString());
                                    });
                                    setOpenDeleteModal(false);
                                    router.refresh();
                                }}
                            >
                                Delete
                            </Button>
                            <Button
                                variant="plain"
                                color="neutral"
                                onClick={() => setOpenDeleteModal(false)}
                            >
                                Cancel
                            </Button>
                        </DialogActions>
                    </ModalDialog>
                </Modal>
            )}
        </>
    );
}
