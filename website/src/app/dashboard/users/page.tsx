"use client"
import { getUsers } from '@/actions/user';
import { unCamelCase } from '@/utils/utils';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Sheet } from '@mui/joy';
import Typography from '@mui/joy/Typography';
import { DataGrid, GridColDef, GridRowsProp, GridToolbar } from '@mui/x-data-grid';
import { QueryResult, QueryResultRow } from '@vercel/postgres';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import * as React from 'react';

export default function Page() {
    const [users, setUsers] = React.useState<QueryResult<QueryResultRow> | null>(null)
    const router = useRouter();
    React.useEffect(() => {
        const test = async () => {
            const users = await getUsers()
            setUsers(users)
        }
        test()
    }, [])

    //Remove the filed named emailVerified
    const rows: GridRowsProp = users?.rows.map((row) => {
        const newRow: any = {}
        for (const [key, value] of Object.entries(row)) {
            if (key !== "emailVerified") {
                newRow[key] = value
            }
        }
        return newRow
    }) || []
    const columns: GridColDef[] = users?.fields.filter((field) => field.name !== "emailVerified").map((field) => {
        if (field.name === "image") {
            return {
                field: field.name,
                headerName: unCamelCase(field.name),
                width: 150,
                renderCell: (params) => (
                    <Image src={params.value} alt="profile picture" width={40} height={40} />
                )
            }
        } else {
            return {
                field: field.name,
                headerName: unCamelCase(field.name),
                width: 150,
            }
        }
    }) || []

    columns.push({
        field: "action",
        headerName: "Action",
        width: 150,
        renderCell: (params) => (
            <IconButton onClick={() => router.push(`/dashboard/users/edit/${params.row.id}`)}><EditIcon /></IconButton>
        )
    })

    return (
        <>
            <Typography level="h2" component="h1">
                Users
            </Typography>
            <Sheet
                variant="outlined"
                sx={{
                    display: { xs: 'none', sm: 'initial' },
                    width: '100%',
                    borderRadius: 'sm',
                    flexShrink: 1,
                    overflow: 'auto',
                    minHeight: 0,
                }}>
                <DataGrid rows={rows} columns={columns} slots={{ toolbar: GridToolbar }}/>
            </Sheet>
        </>

    );
}