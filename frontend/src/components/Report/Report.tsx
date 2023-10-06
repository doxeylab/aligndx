import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PageviewIcon from '@mui/icons-material/Pageview';

import { useSubmissions } from '../../api/Submissions'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

import CustomIframe from '../../components/CustomIframe';
import FullScreenDialog from '../../components/FullScreenDialog';

interface IReport {
    subId: string;
    disabled?: boolean;
}

export default function Report(props: IReport) {
    const { subId, disabled } = props
    const [result, setResult] = useState<string | null>(null);
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
        onSuccess(data: any) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data?.data, "text/html");

            const script = doc.createElement("script");
            script.textContent = `
                const fixAnchors = () => {
                    const anchorTags = Array.from(document.querySelectorAll("a"));
                    anchorTags.forEach((anchor) => {
                        const id = anchor.getAttribute("href");
                        if (id != null) {
                            anchor.setAttribute("href", "about:srcdoc" + id);
                        }
                    });
                };

                window.onload = function () {
                    fixAnchors()
                }
            `

            doc.body.appendChild(script)
            const modifiedHtmlContent = doc.documentElement.outerHTML;
            setResult(modifiedHtmlContent)
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
                    {report.isFetching ?
                        <CircularProgress size={24}/>
                        :
                        <PageviewIcon />
                    }
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