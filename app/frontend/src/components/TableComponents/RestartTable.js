import BaseTable from "./BaseTable";
import { Col, Container, Row } from 'react-bootstrap';
import UploadComponent from '../UploadComponent';
import Button from "../Button";

const result_modal = (props) => {
    return (
        <Container>
            <UploadComponent
                fileCallback={props.dataFileCallback}
                selectedFiles={props.selectedFiles}
                removeCallback={props.dataRemoveFileCallback}
            />
            <Button fill disabled={(props.selectedFiles).length === 0} onClick={props.upload}>Analyze</Button>
        </Container>
    )

}


const RestartTable = (props) => {
    // pass one extra header to account for collapsible cell
    const headers = ["File Name", "Selected Panel", "Date Created", ""]
    const data = props.data
    const re_organized_data = []

    const organize_data = (data) => {
        const id = data.id
        const name = data.sample_name
        const panel_capitalized = data.panel.charAt(0).toUpperCase() + data.panel.slice(1)
        const meta = [panel_capitalized, data.created_date]
        const result = result_modal(props)

        re_organized_data.push({ name, meta, result, id });
    }

    data.forEach(point => organize_data(point))
    return (
        <BaseTable
            headers={headers}
            data={re_organized_data}
            setSelectedData={props.setSelectedRestartData}
        ></BaseTable>
    )
}

export default RestartTable