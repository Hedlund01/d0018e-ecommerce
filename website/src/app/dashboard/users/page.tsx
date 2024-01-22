"use client"
import * as React from 'react';
import Typography from '@mui/joy/Typography';
import { QueryResult, QueryResultRow, sql } from '@vercel/postgres';
import { getUsers } from './actions';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Button, Dropdown, MenuButton, MenuItem, Table, Menu, IconButton, ListItemDecorator } from '@mui/joy';
import Image from 'next/image';
import { DeleteForever } from '@mui/icons-material';
import { unCamelCase } from '@/utils/utils';

export default function Page() {
    const [users, setUsers] = React.useState<QueryResult<QueryResultRow> | null>(null)
    React.useEffect(() => {
        const test = async () => {
            const users = await getUsers()
            setUsers(users)
        }
        test()
    }, [])


    return (
        <>

            <Typography level="h2" component="h1">
                Users
            </Typography>
            <Table >
                <thead>
                    <tr>
                        {users?.fields.map((field) => (
                            <th key={field.name}>{unCamelCase(field.name)}</th>
                        ))}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    
                    {
                        users?.rows.map((row) => (
                        <tr key={row.id}>
                            {users.fields.map((field) => {
                                if (field.name === "image") {
                                    return <td key={field.name}><Image src={row[field.name]} alt="profile picture" width={40} height={40} /></td>
                                } else {
                                    return <td key={field.name}>{row[field.name]}</td>
                                }
                            }
                            )}
                            <td>
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
            </Table>

        </>

    );
}