import Container from '@mui/material/Container' 
import PipelineForm from '../../components/PipelineForm'

export default function Analyze() {

    return (
        <>
            <Container maxWidth={false} sx={{ mt: 4, mb: 4, }}>
                <PipelineForm />
            </Container>
        </>
    )
}
