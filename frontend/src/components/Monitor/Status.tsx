import Button from '@mui/material/Button'

export default function Status({data}: any) {
    const status = data?.status
    if (status == 'created') {
        return (
            <Button
                color="warning"
                variant={'contained'}>
                Status | {status}
            </Button>
        )
    }
    else if (status == 'queued') {
        return (
            <Button
                color="warning"
                variant={'contained'}>
                Status | {status} in positon {data?.position}
            </Button>
        )
    }
    else if (status == 'processing') {
        return (
            <Button
                color="info"
                variant={'contained'}>
                Status | {status}
            </Button>
        )
    }
    else if (status == 'completed') {
        return (
            <Button
                color="success"
                variant={'contained'}>
                Status | {status}
            </Button>
        )
    }
    else if (status == 'error') {
        return (
            <Button
                color="error"
                variant={'contained'}>
                Status | {status}
            </Button>
        )
    }
    else {
        return null
    }
}