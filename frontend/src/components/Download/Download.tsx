import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import Tooltip from '@mui/material/Tooltip';

import { useSubmissions } from '../../api/Submissions'
import { useQuery } from '@tanstack/react-query'
import { CircularProgress } from '@mui/material';

interface IDownload {
    subId: string;
    disabled?: boolean;
}

export default function Download(props: IDownload) {
    const { subId, disabled } = props
    const submissions = useSubmissions();

    function saveAs(blob :any, fileName : any) {
        const url = window.URL.createObjectURL(blob);

        const anchorElem = document.createElement("a");
        // anchorElem.style = "display: none";
        anchorElem.href = url;
        anchorElem.download = fileName;

        document.body.appendChild(anchorElem);
        anchorElem.click();

        document.body.removeChild(anchorElem);

        // On Edge, revokeObjectURL should be called only after
        // a.click() has completed, atleast on EdgeHTML 15.15048
        setTimeout(function () {
            window.URL.revokeObjectURL(url);
        }, 1000);
    }

    const download = useQuery({
        queryKey: ['download', subId],
        queryFn: () => submissions.download(subId),
        retry: false,
        enabled: false,
        onSuccess(data : any) {
            const blob = new Blob([data.data], { type: "application/octet-stream" });
            const name = data.headers['content-disposition']?.split('filename=')[1].split(';')[0];
            saveAs(blob, name)
        }
    })

    if (disabled) {
        return null;
    }

    return (
        <Tooltip title="Download Report">
            <IconButton
                size="large"
                aria-label="download"
                onClick={() => download.refetch()}>
                {download.isFetching? 
                   <CircularProgress size={24}/>
                   :
                    <DownloadIcon />
                }
            </IconButton>
        </Tooltip>
    )
}