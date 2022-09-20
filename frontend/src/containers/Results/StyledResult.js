import styled from 'styled-components';

export const ResultTitle = styled.h1`
    font-size: 3.2rem;
    margin-bottom: 3.2rem;
`

export const ResultAccordion = styled.div`
    display: flex;
    flex-direction: column;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);
    background-color: $white-color;
    border-radius: 10px;
    margin: 10px 0;
`

export const ResultAccordionButton = styled.button`
    background-color: $white-color;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    padding: 12px;
    display: flex;
    align-items: center;
    outline: none;
    transition: background-color 0.6s ease;
    ${props => props.active ?
        `` :
        `background-color: #d3d3d3`
    }
`

export const ResultAccordionImg = styled.img`
    width: 50px;
    padding: 10px;
    height: auto;
    margin-right: 2rem;
`

export const ResultAccordianTitle = styled.h1`
    display: flex;
    margin: 0;
    vertical-align: middle;
    align-items: center;
    ${props => props.detection === "Negative" ?
        `color: #f70103` :
        `color: #55c245`
    }
`

export const ResultsContainer = styled.div`
    font-size: 1.5rem;
`