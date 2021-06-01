import styled from 'styled-components';

export const Title = styled.h1`
    margin: 0px;
    margin-bottom: 4.5rem;
    text-transform: uppercase;
    font-size: 4rem;
    text-align: center;
`

export const Section = styled.section`
    min-height: 100vh;
    display: flex;
    ${
        props => props.center ? 
            `justify-content: center;
            align-items: center;
            `
        :
            ``
    }
`