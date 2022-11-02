import styled from 'styled-components';

export const DropzoneMessage = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #4aa1f3;
    font-size: 1.6rem;
`

export const Dropzone = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  height: 200px;
  width: 100%;
  border-radius: 1.6rem;
  border: 4px ${props => props.active ? `solid` : `dashed`} #4aa1f3;
  transition: 0.3s;
  ${props => props.active ? `background-color: #e8f7fe;` : ``}

  &:hover {
      background-color: #e8f7fe;
  }
  &:active ${DropzoneMessage} {
    transform: scale(0.97);
  }
`

export const DropzoneInput = styled.input`
    display: none;
`

export const DropzoneTitle = styled.h1`
    display: inline-flex;
`