import BaseTable from "./BaseTable";
import Button from "../Button"; 
import ChunkProcessor from "../ChunkController/chunkProcessor"
import { useHistory } from "react-router-dom";


const Restart_chunking = (data) => {
    const history = useHistory()
    const fileId = data.id
    history.push({
        pathname: "/realtime/#/?id=" + fileId,
        state: {
            // file: data.dataFile,
            panels: data.panel,
            fileId: fileId,
            restartflag: true  
        }
    }
    )
}


const Continue_ui = (data) => {
    return (
        <Button onclick={() => alert()}>Continue</Button>
    )
}

const RestartTable = (props) => {
    // pass one extra header to account for collapsible cell
    const headers = ["File Name", "Selected Panel", "Date Created", ""]
    const data = props.data
    const re_organized_data = []
    
    const organize_data = (data) => {
        const name = data.sample_name
        const panel_capitalized = data.panel.charAt(0).toUpperCase() + data.panel.slice(1)
        const meta = [panel_capitalized,data.created_date]
        const result = <Button onclick={() => alert()}>Continue</Button>
        re_organized_data.push({name, meta, result});
    }

    data.forEach(point => organize_data(point))
    return (
        <BaseTable headers={headers} data={re_organized_data} changecollapse={true} 
        ></BaseTable>
    )
}

export default RestartTable