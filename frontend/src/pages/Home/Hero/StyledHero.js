import Col from 'react-bootstrap/Col';
import styled from 'styled-components';
import { device } from '../../../StyledGlobal';

export const HeroCol = styled(Col)`
    display: flex;
    align-items: center;
    justify-content: center;
`

export const HeroImage = styled.img`
    @media ${device.xs} {
        width: 250px;
    }

    @media ${device.sm} {
        width: 250px;
    }

    @media ${device.md} {
        width: 300px;
    }

    @media ${device.lg} {
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
    text-align: left;
    margin-bottom: 2.4rem;
    font-weight: 700;

    @media ${device.xs} {
        font-size: 4.6rem;
        text-align: center;
    }

    @media ${device.sm} {
        font-size: 4.2rem;
    }

    @media ${device.md} {
        font-size: 4.6rem;
    }

    @media ${device.lg} {
        font-size: 5.6rem;
    }
`

export const HeroText = styled.p`
    text-align: left;
    margin-bottom: 2.4rem; 

    @media ${device.xs} {
        font-size: 1.4rem;
        margin-bottom: 1.2rem; 
        padding: 0 3rem;
        text-align: center;
    }

    @media ${device.sm} {
        font-size: 1.2rem;
    }

    @media ${device.md} {
        font-size: 1.6rem;
    }
`

export const HeroBtns = styled.div`
    display: none;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    Button {
        margin: 0 5px;
    }

    @media ${device.md} {
        display: flex;
        width: 100%;
    }

    @media ${device.lg} {
        width: 70%;
    }
`

export const HeroBtns2 = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;

    @media ${device.md} {
        display: none;
    }

    Button {
        margin: 0 5px;
    }
`