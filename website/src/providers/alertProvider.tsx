"use client"
import { Alert, Button, Snackbar } from '@mui/joy';

import React, { createContext, useContext } from 'react';

type SnackBarContextActions = {
    showSnackBar: (text: string, severity: "primary" | "neutral" | "danger" | "success" | "warning") => void;
};

const SnackBarContext = createContext({} as SnackBarContextActions);

interface SnackBarContextProviderProps {
    children: React.ReactNode;
}

const SnackBarProvider: React.FC<SnackBarContextProviderProps> = ({
    children,
}) => {
    const [open, setOpen] = React.useState<boolean>(false);
    const [message, setMessage] = React.useState<string>('');
    const [typeColor, setTypeColor] = React.useState<"primary" | "neutral" | "danger" | "success" | "warning">('primary');

    const showSnackBar = (text: string, severity: "primary" | "neutral"  | "danger" | "success" | "warning") => {
        setMessage(text);
        setTypeColor(severity);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setTypeColor('primary');
    };

    return (
        <SnackBarContext.Provider value={{ showSnackBar }}>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
                variant='outlined'
                color={typeColor}
                endDecorator={
                    <Button
                        onClick={() => setOpen(false)}
                        size="sm"
                        variant="soft"
                        color="neutral"
                    >
                        Dismiss
                    </Button>
                }
            >
                {message}
            </Snackbar>
            {children}
        </SnackBarContext.Provider>
    );
};

const useSnackBar = (): SnackBarContextActions => {
    const context = useContext(SnackBarContext);

    if (!context) {
        throw new Error('useSnackBar must be used within an SnackBarProvider');
    }

    return context;
};

export { SnackBarProvider, useSnackBar };