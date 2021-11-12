import styled from 'styled-components';

export const HeroImage = styled.div`
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    img {
        width: 400px;
    }
`

export const HeroBody = styled.div`
    display: flex;
    height: 100%;
    justify-content: center;
    flex-direction: column;
`

export const HeroTitle = styled.h1`
    font-size: 5.6rem;
    text-align: left;
    margin-bottom: 2.4rem;
`

export const HeroText = styled.p`
    font-size: 1.6rem;
    text-align: left;
    margin-bottom: 2.4rem; 
`

export const HeroBtns = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 70%;

    Button {
        margin: 0 5px;
    }
`