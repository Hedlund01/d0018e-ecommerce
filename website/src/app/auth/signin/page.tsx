"use client"
import * as React from 'react';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import { getProviders, signIn, useSession } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { useRouter } from 'next/navigation';



export default function Page() {
    const { data, status } = useSession();
    const router = useRouter();
    if (status === 'authenticated') {
        router.replace('/')
    }
    if(status === "loading") return <p>loading...</p>


    return (

        <Stack gap={4} sx={{ mb: 2 }}>
            <Stack gap={1}>
                <Typography level="h3">Welcome</Typography>
                <Typography level="body-sm">
                    Lorem Lipsum

                </Typography>
            </Stack>
            <Button
                variant="soft"
                color="neutral"
                fullWidth
                onClick={() => signIn('github')}
            >
                Continue with Github
            </Button>
        </Stack>

    );
}