import styled from 'styled-components';

export const ResultCard = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr) 1.2rem;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
    background-color: #fff;
    border-radius: 5px;
    margin: 10px 0;
    padding: 10px 30px;
    width: 100%;
    height: 50px;
    align-items: center;
    cursor: pointer;
    transition: all cubic-bezier(0.19, 1, 0.22, 1) 0.6s;
    &:hover {
        transform: scale(1.02);
        background-color: #F4FBFE;
    }
`

export const ResultName = styled.h1`
    font-size: 1.2rem;
    margin: 0;
`

export const UploadDate = styled.span`
    font-size: 1.2rem;
    text-align: center;
`

export const PathogenType = styled.span`
    font-size: 1.2rem;
    text-align: center;
`

export const ChevronIcon = styled.div`
    font-size: 1.2rem;
    text-align: center;
`