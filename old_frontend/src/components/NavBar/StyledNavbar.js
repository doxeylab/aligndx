// import Button from '@mui/material/Button';
import { Container } from 'react-bootstrap';
import { NavLink as Link } from 'react-router-dom';
import styled from 'styled-components';

const max_width = '992px';

export const Nav = styled.nav`
  position: absolute;
  display: flex;
  align-items: center;
  width: 100%;
  z-index: 3;
  height: 120px;
  font-size: 1.6rem;
`

export const NavContainer = styled(Container)`
  display: grid;
  grid-template-columns: 25% 50% 25%;
  grid-gap: 10px;

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
  font-weight: bold;
  text-decoration: none;
  z-index: 1;
`

export const MobileIcon = styled.div`
  display: none;

  @media screen and (max-width: ${max_width}) {
    display: block;
    justify-self: end;
    cursor: pointer;
    z-index: 1;

    svg {
      fill: #333;
      font-size: 3rem;
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
    width: 100%;

    a {
        margin: 0 5px;
    }

    @media screen and (max-width: ${max_width}) {
      display: none;
    }
`