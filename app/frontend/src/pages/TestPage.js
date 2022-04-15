import EnhancedTable from "../components/TableComponents/EnhancedTable";
import { Section } from "../components/Common/PageElement";
import exampleresultstable from "../assets/test_datasets/example_results_table.json"

const TestPage = () => {

    const createData = (id, data, name, created_date, panel ) =>{
        return {
            id,
            data,
            name,
            created_date,
            panel
        }
    }

    const sample_results = exampleresultstable
    const rows = []


    sample_results.forEach((data) =>{
        rows.push(
            createData(data.id, data.result, data.name, data.created_date, data.panel)
        )
    })
    
    const headCells = [
        {
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: 'File/Sample Name',
        },
        {
            id: 'created_date',
            numeric: true,
            disablePadding: false,
            label: 'Created Date',
        }, 
        {
            id: 'panel',
            numeric: true,
            disablePadding: false,
            label: 'Panel',
        }, 
    ];

    const contentgenerator = (data) =>{
        return (
            <div>{JSON.stringify(data)}</div>
        )
    }

    return (
        <Section>
            <EnhancedTable tableName="My Results" rows={rows} headCells={headCells} contentgenerator={contentgenerator}> 
            </EnhancedTable>
        </Section>
    )
}

export default TestPage;