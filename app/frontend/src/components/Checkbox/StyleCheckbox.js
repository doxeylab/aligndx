import styled from "styled-components";

export const Input = styled.input`
  height: 0;
  width: 0;
  opacity: 0;
  z-index: -1;
  position: absolute;
`;

export const Label = styled.p`
    margin: 0;
`

export const CheckboxContainer = styled.div`
    display: flex;
    align-items: center;
  cursor: pointer;
`;

export const Indicator = styled.div`
  width: 1.3rem;
  height: 1.3rem;
  background: #fff;
  border: 0.25rem solid #2f8ae1;
  margin-right: 0.5rem;

  ${Input}:checked + & {
    background: #2f8ae1;
  }

  &::after {
    content: "";
    display: none;
  }

  ${Input}:checked + &::after {
      background: #2f8ae1;
  }
`;