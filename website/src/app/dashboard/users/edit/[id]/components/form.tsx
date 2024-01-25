"use client"

import { User, UserRole, userRoleEnum } from "@/types/user";
import { unCamelCase } from "@/utils/utils";
import { Button, FormControl, FormLabel, Input, Option, Select, Stack } from "@mui/joy";
import { useState } from "react";


export default function Form({ user, action }: { user?: User, action: (data: FormData) => void }) {
    const [role, setRole] = useState<UserRole>(user?.role || "user")
    return (
        <form onSubmit={(event) => {
            event.preventDefault()
            const formData = new FormData(event.target as HTMLFormElement)
            formData.append("role", role?.toString() || "user")
            action(formData)
        
        }}>
            <Stack spacing={1}>
                <Input id="id" name="id" value={user?.id} sx={{
                    display: "none"

                }} />
                <FormControl>
                    <FormLabel id="name">Name</FormLabel>
                    <Input id="name" name="name" value={user?.name} disabled />
                </FormControl>
                <FormLabel>Email</FormLabel>
                <Input name="email" value={user?.email} disabled />
                <FormLabel>Email Verified</FormLabel>
                <Input name="emailVerified" value={user?.emailVerified?.toDateString()} disabled />
                <FormLabel>Image</FormLabel>
                <Input name="image" value={user?.image} disabled />
                <FormLabel>Role</FormLabel>
                <Select placeholder="Choose a role" value={role} onChange={(_, value) => setRole(value || "user")}>
                    {
                        userRoleEnum.unwrap().options.map((option) => (
                            <Option key={option} value={option.toString()}>{unCamelCase(option)}</Option>
                        ))
                    }
                </Select>
                <Button type="submit">Submit</Button>

            </Stack>

        </form>
    )
}