import Button from '@mui/material/Button'

export default function StatusButton({status}: any) {
    if (status == 'setup') {
        return (
            <Button
                color="warning"
                variant={'contained'}>
                {status}
            </Button>
        )
    }
    else if (status == 'processing') {
        return (
            <Button
                color="info"
                variant={'contained'}>
                {status}
            </Button>
        )
    }
    else if (status == 'completed') {
        return (
            <Button
                color="sucess"
                variant={'contained'}>
                {status}
            </Button>
        )
    }
    else if (status == 'error') {
        return (
            <Button
                color="error"
                variant={'contained'}>
                {status}
            </Button>
        )
    }
    else {
        return null
    }
}