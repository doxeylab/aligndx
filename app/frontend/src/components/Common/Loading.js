import { Col, Container, Row } from 'react-bootstrap';
import styled from "styled-components";
import LoadingDNA from '../../assets/Common/LoadingDNA.gif';
import { Section } from '../Common/PageElement';

export const LoadCol = styled(Col)`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`

const Loading = () => {
    return (
        <Section id="loading" full center>
            <Container>
                <Row>
                    <LoadCol>
                        <img src={LoadingDNA} alt="loading-dna" width={500} />
                        <h2>Loading...</h2>
                    </LoadCol>
                </Row>
            </Container>
        </Section>
    )
}

export default Loading;