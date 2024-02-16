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
import { deleteOrderLines, getOrderLines } from "@/actions/orderLines";
import { OrderLine, orderLineSchema } from "@/types/order_line";
import { useState } from "react";

export default function Page({
    params,
}: {
    params: {
        id: string;
    };
}) {
    const [orderLines, setOrderLines] = React.useState<OrderLine[]>([]);
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
    const router = useRouter();

    const createLink = (id: string) => {
        return `/dashboard/orders/${id}/create`;
    };

    React.useEffect(() => {
        const localAsync = async () => {
            const getOrderLinesResult = await getOrderLines(params.id);
            setOrderLines(getOrderLinesResult);
        };
        localAsync();
    }, []);

    const [rowSelectionModel, setRowSelectionModel] =
        useState<GridRowSelectionModel>([]);

    //Remove the field named emailVerified
    const rows: GridRowsProp = orderLines;
    const columns: GridColDef[] = Object.keys(
        orderLineSchema.keyof().Values
    ).map((key) => {
        return {
            field: key,
            headerName: unCamelCase(key),
            width: 150,
        };
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
                    Order Lines
                </Typography>
                <Link href={createLink(params.id)}>
                    <Button
                        color="primary"
                        startDecorator={<AddIcon />}
                        size="sm"
                    >
                        Add Order Line
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
                            Are you sure you want to delete these products from
                            the order?
                        </DialogContent>
                        <DialogActions>
                            <Button
                                variant="solid"
                                color="danger"
                                onClick={async () => {
                                    rowSelectionModel.forEach(async (id) => {
                                        await deleteOrderLines(id.toString());
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
