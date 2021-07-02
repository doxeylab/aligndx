import styled from 'styled-components';

export const ProfileBtn = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.6rem;
  border-radius: 8px;
  height: 40px;
  padding: 15px;
  cursor: pointer;
  transition: all cubic-bezier(0.19, 1, 0.22, 1) 0.6s;
  &:hover{
    background: rgba(0, 0, 0, 0.1)
  }
`

export const ProfileIcon = styled.div`
  margin-top: -3px;
`

export const ProfileName = styled.span`
  margin: 0 15px;
`

export const Chevron = styled.div`
  margin-top: -4px;
`

export const ProfileMenu = styled.div`
  background: #fff;
  border-radius: 5px;
  padding: 10px;
  min-width: 100%;
  box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.2);
`

export const ProfileMenuList = styled.ul`
  margin: 0;
`

export const ProfileMenuItem = styled.a`
  text-decoration: none;
  display: block;
  width: 100%;
  padding: .75rem 1.5rem;
  clear: both;
  font-weight: 400;
  color: #333;
  text-align: inherit;
  white-space: nowrap;
  background-color: transparent;
  border-radius: 0.5rem;
  cursor: pointer;
  &:hover {
    color: #333;
    background: rgba(0, 0, 0, 0.1)
  }
`