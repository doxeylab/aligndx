import styled from 'styled-components';
import {NavLink as Link} from 'react-router-dom';

export const Header = styled.h2`
    text-align: center;
    margin-bottom: 4rem;
`

export const ContactWrapper = styled.div`
    display: grid;
    flex-direction: column;
    justify-content: center;
`

export const ContactItem= styled.div`
    display: flex;
    margin-bottom: 3rem;
`

export const ContactIcon = styled.div`
    width: 60px;
    height: 60px;
    font-size: 2.2rem;
    background: #c6c6c6;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 2rem;
`

export const ContactText = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0;
`

export const ContactTitle = styled.h3`
    margin: 0;
`

export const ContactInfo = styled.p`
    margin: 0;
`