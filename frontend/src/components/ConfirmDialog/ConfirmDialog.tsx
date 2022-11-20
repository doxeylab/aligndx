import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    IconButton,
    Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface confirmDialogProps {
    title: string;
    message: string;
    open: boolean;
    close(): boolean;
    onConfirm(): string;
}

export default function ConfirmDialog(props: confirmDialogProps) {
    const { title, message, open, close, onConfirm } = props;

    return (
        <>
            <Dialog
                open={open}
                onClose={close}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>{title}</DialogTitle>
                <Box position="absolute" top={0} right={0}>
                    <IconButton onClick={close}>
                        <Close />
                    </IconButton>
                </Box>
                <DialogContent>
                    <Typography>{message}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" variant="contained" onClick={close}>
                        Cancel
                    </Button>
                    <Button
                        color="secondary"
                        variant="contained"
                        onClick={() => {
                            onConfirm();
                            close();
                        }}
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}