import styled from 'styled-components';
import {NavLink as Link} from 'react-router-dom';
import { Container } from 'react-bootstrap';

const max_width = '992px';

export const Nav = styled.nav`
  position: absolute;
  display: flex;
  align-items: center;
  width: 100%;
  z-index: 1;
  height: 120px;
`

export const NavContainer = styled(Container)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  @media screen and (max-width: ${max_width}) {
    grid-template-columns: repeat(2, 1fr);
  }
`

export const NavLogo = styled(Link)`
  justify-self: flex-start;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  margin-left: 24px;
  font-weight: bold;
  text-decoration: none;
  z-index: 1;
`

export const MobileIcon = styled.div`
  display: none;

  @media screen and (max-width: ${max_width}) {
    display: block;
    justify-self: end;
    font-size: 3rem;
    cursor: pointer;
    z-index: 1;

    svg {
      fill: #333;
    }
  }
`

export const NavMenu = styled.ul`
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    text-align: center;
    margin: 0;
    padding: 0;

    @media screen and (max-width: ${max_width}) {
      display: none;
    }
`

export const NavItem = styled.li`
  height: 80px;
`

export const NavLink = styled(Link)`
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
    }
`

export const NavBtn = styled.div`
    display: flex;
    align-items: center;
    justify-self: end;
    margin-right: 24px;

    @media screen and (max-width: ${max_width}) {
      display: none;
    }
`

export const NavBtnLink = styled(Link)`
    position: relative;
    font-weight: bold;
    font-size: 1.6rem;
    line-height: 1;
    z-index: 1;
    transition: all cubic-bezier(0.19, 1, 0.22, 1) 0.6s;
    overflow: hidden;
    margin: 0 5px;
    border-radius: 8px;

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
        }

        &:hover {
          background-position: right center;
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

        &:hover {
          .btn-text {
            -webkit-text-fill-color: #fff;
            text-decoration: none;
          }
          &::after {
            width: 100%;
          }
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