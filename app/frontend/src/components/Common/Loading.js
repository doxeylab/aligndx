import { Col, Container, Row, ProgressBar } from 'react-bootstrap';
import styled from "styled-components";
import LoadingDNA from '../../assets/Common/LoadingDNA.gif';
import { Section } from '../Common/PageElement';

export const LoadCol = styled(Col)`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .progress {
        width: 400px;
        max-width:100%;
        height: 15px;
    }
` 

const Loading = (props) => {
    return (
        <Section id="loading" full center>
            <Container>
                <Row>
                    <LoadCol>
                        <img src={LoadingDNA} alt="loading-dna" width={500} />
                        <ProgressBar now={props.progress} label={`Uploaded ${props.progress}%`} width={500}/>
                    </LoadCol>
                </Row>
            </Container>
        </Section>
    )
}

export default Loading;