import { Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import styled from 'styled-components';

export const FormContainer = styled(Form)`
    display: flex;
    flex-direction: column;
    background-color: #fff;
    box-shadow: 4px 6px 15px rgba(0, 0, 0, 0.2);
    border-radius: 1.2rem;
    width: 100%;
    padding: 3rem;

    h1 {
        color: #1861a7;
        margin-bottom: 2.5rem;
    }
`

export const FormInput = styled(Row)`
    margin-bottom: 10px;
`

export const FormBtn = styled(Row)`
    margin: 1rem 0;
`

export const ErrorMsg = styled.p`
    margin-top: 0.5rem;
    margin-bottom: 0;
    color: #cc0000;
`