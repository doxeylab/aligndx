import styled from "styled-components";
import { Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const Bar = styled.div`
  border-left: 2px solid #7c8ba1;
  height: auto;
  margin: 0 15px;
`

export const Foot = styled.footer`
  display: flex;
  align-items: center;
  width: 100%;
  height: 250px;
  background: #ffffff;
  font-weight: 500;
  border-top: solid;
  border-top-width: 1px;
  border-top-color: rgba(124, 139, 161, 0.1);
`

export const FooterCenterCol = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const FooterCopyright = styled.p`
  font-size: 1rem;
`

export const FooterLogo = styled(Link)`
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  font-weight: bold;
  text-decoration: none;
  z-index: 1;
  margin-bottom: 3.5rem;
`

export const FooterMenu = styled.ul`
    display: flex;
    flex-direction: row;
    list-style: none;
    text-align: center;
    margin-bottom: 3rem;
    padding: 0;
`

export const FooterLink = styled(Link)`
  font-size: 1.4rem;
  font-weight: 500;
  color: #243e63;
  margin: 0 15px;
  transition-duration: 300ms;
  &::after {
    content: "";
    display: block;
    margin: auto;
    height: 2px;
    width: 0;
    background: transparent;
    transition: width 500ms ease;
  }
  &:hover {
    color: #567095;
  }
  &:hover::after {
    width: 100%;
    background: #567095;
  }
`

export const FooterA = styled.a`
  font-size: 14px;
  font-weight: 500;
  color: #243e63;
  margin: 0 15px;
  transition-duration: 300ms;
  &::after {
    content: "";
    display: block;
    margin: auto;
    height: 2px;
    width: 0;
    background: transparent;
    transition: width 500ms ease;
  }
  &:hover {
    color: #567095;
  }
  &:hover::after {
    width: 100%;
    background: #567095;
  }
`