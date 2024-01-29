"use client"
import * as React from 'react';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CircularProgress } from '@mui/joy';
import Image from 'next/image'
import GitHubIcon from '@mui/icons-material/GitHub';


export default function Page() {
    const { data, status } = useSession();
    const router = useRouter();
    if (status === 'authenticated') {
        router.replace('/')
    }
    if (status === "loading") return <CircularProgress />

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
                endDecorator={<GitHubIcon />}
            >
                Continue with Github
            </Button>

            <Button
                variant="soft"
                color="neutral"
                fullWidth
                onClick={() => signIn('authentik')}
                endDecorator={<Image alt="Hedlund auth logo" src="/hedlund-auth-logo.png" width={35} height={35} />}
            >
                Continue with Hedlund Auth
            </Button>
        </Stack>

    );
}