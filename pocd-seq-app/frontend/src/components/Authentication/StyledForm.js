import styled from 'styled-components';
import {Row} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

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
        margin: 2.5rem 0;
    }
`

export const FormInput = styled(Row)`
    margin-bottom: 10px;
`

export const FormBtn = styled(Row)`
    margin: 3rem 0;
`