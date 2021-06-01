import styled from 'styled-components';
import {NavLink as Link} from 'react-router-dom';

export const Nav = styled.nav`
  height: 120px;
  display: fixed;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  position: absolute;
  width: 100%;
  top: 0;
  z-index: 1;

  @media screen and (max-width: 830px) {
    transition: 0.8s all ease;
  }
`

export const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height: 80px;
  width: 100%;
  padding: 0 24px;
  max-width: 1100px;
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

  @media screen and (max-width: 830px) {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-100%, 72%);
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
    align-items: center;
    list-style: none;
    text-align: center;
    margin: 0;
    padding: 0;

    @media screen and (max-width: 830px) {
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

    @media screen and (max-width: 830px) {
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