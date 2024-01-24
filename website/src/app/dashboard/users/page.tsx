"use client"
import * as React from 'react';
import Typography from '@mui/joy/Typography';
import { QueryResult, QueryResultRow, sql } from '@vercel/postgres';
import { getUsers } from './actions';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Button, Dropdown, MenuButton, MenuItem, Table, Menu, IconButton, ListItemDecorator, Sheet } from '@mui/joy';
import Image from 'next/image';
import { DeleteForever } from '@mui/icons-material';
import { unCamelCase } from '@/utils/utils';
import { DataGrid, GridColDef, GridRowsProp, GridToolbar } from '@mui/x-data-grid';

export default function Page() {
    const [users, setUsers] = React.useState<QueryResult<QueryResultRow> | null>(null)
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
    console.log(rows)
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
    console.log(columns)

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
                <DataGrid rows={rows} columns={columns} slots={{ toolbar: GridToolbar }} />
                {/* <Table
                    stickyHeader
                    hoverRow
                    sx={{
                        '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
                        '--Table-headerUnderlineThickness': '1px',
                        '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
                        '--TableCell-paddingY': '4px',
                        '--TableCell-paddingX': '8px',
                        "overflowX": "scroll",
                        "minWidth": "100%"
                    }}
                    
                >
                    <thead>
                        <tr>
                            {users?.fields.filter((field) => field.name !== "emailVerified").map((field) => (
                                <th key={field.name} >{unCamelCase(field.name)}</th>
                            ))}
                            <th >Actions</th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            users?.rows.map((row) => (
                                <tr key={row.id} >
                                    {users.fields.filter((field) => field.name !== "emailVerified").map((field) => {
                                        if (field.name === "image") {
                                            return <td key={field.name} ><Image src={row[field.name]} alt="profile picture" width={40} height={40} /></td>
                                        } else {
                                            return <td key={field.name} >{row[field.name]}</td>
                                        }
                                    }
                                    )}
                                    <td >
                                        <Dropdown>
                                            <MenuButton
                                                slots={{ root: IconButton }}
                                                slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}
                                            >
                                                <MoreHorizIcon />
                                            </MenuButton>
                                            <Menu>
                                                <MenuItem>Edit</MenuItem>
                                                <MenuItem variant="soft" color="danger">
                                                    <ListItemDecorator sx={{ color: 'inherit' }}>
                                                        <DeleteForever />
                                                    </ListItemDecorator>{' '}
                                                    Delete
                                                </MenuItem>
                                            </Menu>
                                        </Dropdown>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table> */}
            </Sheet>
        </>

    );
}