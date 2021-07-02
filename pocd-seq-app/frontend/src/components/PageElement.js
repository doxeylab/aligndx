import styled from 'styled-components';

const handleTitleAlign = align => {
    switch (align) {
      case "left":
        return "left";
      case "right":
        return "right";
      default:
        return "center";
    }
  };

export const Title = styled.h1`
    margin: 0px;
    margin-bottom: 4.5rem;
    text-transform: uppercase;
    font-size: 4rem;
    text-align: ${({align}) => handleTitleAlign(align)};
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
            `padding-top: 120px;`
    }
`