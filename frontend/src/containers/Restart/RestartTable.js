import {SimpleTable} from "../../components/TableComponents";
import { Col, Container, Row } from 'react-bootstrap';
import UploadComponent from '../../components/UploadComponent';
import Button from "../../components/Button";

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
        const name = data.name
        const panel = data.panel
        const date = Date(data.created_date)
        const meta = [panel, date]
        const result = result_modal(props)

        re_organized_data.push({ name, meta, result, id });
    }

    data.forEach(point => organize_data(point))
    return (
        <SimpleTable
            headers={headers}
            data={re_organized_data}
            setSelectedData={props.setSelectedRestartData}
        ></SimpleTable>
    )
}

export default RestartTable