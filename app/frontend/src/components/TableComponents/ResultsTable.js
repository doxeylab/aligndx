import BaseTable from "./BaseTable";
import BarChart from "../BarChart";

const createBarChart = (chart_data) => { 
    if (chart_data) {
        return (
            <BarChart data={chart_data} yLabel={chart_data.ylabel} xLabel={chart_data.xlabel} col="coverage" xkey="Pathogen" ykey="Coverage" />
        )
    }
    else {
        return (
            <div>Data still processing</div>
        )
    }
}


const ResultsTable = (props) => {
    // pass one extra header to account for collapsible cell
    const headers = ["File Name", "Selected Panel", "Date Created", ""]
    const data = props.data
    const re_organized_data = []
    
    const organize_data = (data) => {
        const name = data.name
        const panel_capitalized = data.panel.charAt(0).toUpperCase() + data.panel.slice(1)
        const meta = [panel_capitalized,data.created_date]
        const result = createBarChart(data.result) 
        re_organized_data.push({name, meta, result});
    }
    console.log(re_organized_data)

    data.forEach(point => organize_data(point))
    return (
        <BaseTable headers={headers} data={re_organized_data}></BaseTable>
    )
}

export default ResultsTable