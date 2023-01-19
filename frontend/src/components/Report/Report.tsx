import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PageviewIcon from '@mui/icons-material/Pageview';

import { useSubmissions } from '../../api/Submissions'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react';

import CustomIframe from '../../components/CustomIframe';
import FullScreenDialog from '../../components/FullScreenDialog';

interface IReport {
    subId: string;
    disabled?: boolean;
}

export default function Report(props: IReport) {
    const { subId, disabled } = props
    const [result, setResult] = useState(null);
    const [open, setOpen] = useState(false);

    const submissions = useSubmissions();

    const handleClickOpen = (callback: any) => {
        callback(true);
    };

    const handleClose = (callback: any) => {
        callback(false);
    };

    const report = useQuery({
        queryKey: ['report', subId],
        queryFn: () => submissions.get_report(subId),
        retry: false,
        enabled: false,
        onSuccess(data : any) {
            setResult(data?.data)
            handleClickOpen(setOpen)
        }
    })

    if (disabled) {
        return null;
    }

    return (
        <>
            <Tooltip title="View Results">
                <IconButton
                    size="large"
                    aria-label="view-results"
                    onClick={() => report.refetch()}>
                    <PageviewIcon />
                </IconButton>
            </Tooltip>
            {
                result ?
                    <FullScreenDialog
                        open={open}
                        handleClose={() => handleClose(setOpen)}
                        content={
                            <CustomIframe
                                width={'100%'}
                                height={'100%'}
                                frameBorder={0}
                                srcDoc={result} />
                        }
                    />
                    :
                    null
            }
        </>

    )
}