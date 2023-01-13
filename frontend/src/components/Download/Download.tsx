import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import Tooltip from '@mui/material/Tooltip';

import { useResults } from '../../api/Results'
import { useQuery } from '@tanstack/react-query'

interface IDownload {
    subId: string;
    disabled?: boolean;
}

export default function Download(props: IDownload) {
    const { subId, disabled } = props
    const results = useResults();

    function saveAs(blob, fileName) {
        var url = window.URL.createObjectURL(blob);

        var anchorElem = document.createElement("a");
        anchorElem.style = "display: none";
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
        queryFn: () => results.download(subId),
        retry: false,
        enabled: false,
        onSuccess(data) {
            let blob = new Blob([data.data], { type: "application/octet-stream" });
            let name = data.headers['content-disposition']?.split('filename=')[1].split(';')[0];
            saveAs(blob, name)
        },
        onError(err) {
            console.log(err?.response?.status)
        }
    })

    return (
        <Tooltip title="Download Results">
            <IconButton
                disabled={disabled}
                size="large"
                aria-label="download"
                onClick={() => download.refetch()}>
                <DownloadIcon />
            </IconButton>
        </Tooltip>
    )
}