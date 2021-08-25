import styled from 'styled-components';
import {NavLink as Link} from 'react-router-dom';

export const SidebarContainer = styled.aside`
    position: absolute;
    width: 100%;
    height: 100vh;
    background-color: #fff;
    align-items: center;
    left: 0;
    transition: all 0.5s ease;
    ${
        props => props.isOpen ?
            `top: 0
            `
        :
            `top: -768px;
            `
    }
`

export const SidebarDivider = styled.hr`
  border-top: 1px solid #bbb;
  width: 90%;
  margin: 10px auto;
`

export const SidebarProfile = styled.ul`
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(3, 80px);
    text-align: center;
    list-style: none;
    padding: 0;
`

export const SidebarMenu = styled.ul`
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, 80px);
    text-align: center;
    list-style: none;
    margin: 90px 0 0 0;
    padding: 0;
`

export const SidebarLink = styled(Link)`
    color: #333;
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    padding: 0 2rem;
    height: 100%;
    width: 100%;
    cursor: pointer;

    &:hover {
      color: #1861A6;
      background: rgba(0,0,0,0.1)
    }
`

export const SidebarBtn = styled.div`
    display: flex;
    justify-content: center;
    margin: 25px 0;
`

export const SidebarBtnLink = styled(Link)`
    position: relative;
    font-weight: bold;
    font-size: 1.6rem;
    line-height: 2;
    z-index: 1;
    transition: all cubic-bezier(0.19, 1, 0.22, 1) 0.6s;
    ${'' /* overflow: hidden; */}
    margin: 0 5px;
    border-radius: 50px;
    width: 80%;
    display: flex;
    justify-content: center;

    &::after {
      content: "";
      display: block;
      position: absolute;
      width: 0;
      height: 100%;
      left: 0;
      bottom: 0;
      z-index: -1;
      transition: all cubic-bezier(0.19, 1, 0.22, 1) 0.3s;
    }

    ${
      props => props.fill ?
        `padding: 1.0rem 1.8rem;
        background-size: 200% auto;
        background-image: linear-gradient(
          to right,
          #1861A6 0%,
          #2F8AE1 51%,
          #1861A6 100%
        );

        .btn-text {
          background-image: linear-gradient(white, white);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }`
      :
        `padding: 0.8rem 1.6rem;
        border: double 2px transparent;
        background-image: linear-gradient(white, white),linear-gradient(to right, #1861A6, #2F8AE1);
        background-origin: border-box;
        background-clip: padding-box, border-box;

        &::after {
          background-image: linear-gradient(
            to right,
            #1861A6,
            #2F8AE1
          );
        }

        .btn-text {
          background-image: linear-gradient(
            to right,
            #1861A6,
            #2F8AE1
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }`
    }
`