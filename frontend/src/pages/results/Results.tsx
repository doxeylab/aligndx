import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import EnhancedTable from '../../components/Table'

export default function Results() {

    interface HeadCell {
        id: string;
        label: string;
        numeric: boolean;
    }

    // order matters
    const headCells: HeadCell[] = [
        {
            id: 'name',
            label: 'Dessert (100g serving)',
            numeric: false,
        },
        {
            id: 'calories',
            label: 'Calories',
            numeric: true,
        },
        {
            id: 'fat',
            label: 'Fat (g)',
            numeric: true,
        },
        {
            id: 'carbs',
            label: 'Carbs (g)',
            numeric: true,
        },
        {
            id: 'protein',
            label: 'Protein (g)',
            numeric: true,
        },
    ];

    function createData(
        key: string,
        name: string,
        calories: number,
        fat: number,
        carbs: number,
        protein: number,
    ) {
        return {
            key,
            name,
            calories,
            fat,
            carbs,
            protein,
        };
    }

    const rows = [
        createData('1', 'Cupcake', 305, 3.7, 67, 4.3),
        createData('3', 'Donut', 452, 25.0, 51, 4.9),
        createData('4', 'Eclair', 262, 16.0, 24, 6.0),
        createData('5', 'Frozen yoghurt', 159, 6.0, 24, 4.0),
        createData('6', 'Gingerbread', 356, 16.0, 49, 3.9),
        createData('7', 'Honeycomb', 408, 3.2, 87, 6.5),
        createData('8', 'Ice cream sandwich', 237, 9.0, 37, 4.3),
        createData('9', 'Jelly Bean', 375, 0.0, 94, 0.0),
        createData('10', 'KitKat', 518, 26.0, 65, 7.0),
        createData('11', 'Lollipop', 392, 0.2, 98, 0.0),
        createData('12', 'Marshmallow', 318, 0, 81, 2.0),
        createData('13', 'Nougat', 360, 19.0, 9, 37.0),
        createData('14', 'Oreo', 437, 18.0, 63, 4.0),
    ];

    const contentgenerator = (row) => {
        return (
            <div>
                {row.key}
            </div>

            // <Result result={data} />
        )
    }

    const deletefn = (seldata) => {
        console.log(seldata)
        // sub_del.mutate(seldata)
    }

    return (
        <>
            <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <EnhancedTable
                            orderby={{'order':'desc','id':'name', 'key':'key'}}
                            tableName="Results"
                            data={rows}
                            headCells={headCells}
                            contentgenerator={contentgenerator}
                            deletefn={deletefn}
                        >
                        </EnhancedTable>
                    </Grid>
                </Grid>
            </Container>
        </>
    )
};
