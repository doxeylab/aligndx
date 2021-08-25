import React from 'react';
import { 
    Bar,
    Foot, 
    FooterLogo, 
    FooterMenu, 
    FooterCenterCol, 
    FooterLink, 
    FooterA, 
    FooterCopyright 
} from './StyledFooter';
import { Container, Row } from 'react-bootstrap';
import { FooterItems } from './FooterItems';
import AlignDx from '../../assets/AlignDx.svg'

const Footer = () => {
    return (
        <Foot>
            <Container>
                <Row>
                    <FooterCenterCol>
                        <FooterLogo to="/">
                            <img src={AlignDx} style={{width:'150px',height:'auto'}} alt="AlignDx"/>
                        </FooterLogo>
                    </FooterCenterCol>
                </Row>
                <Row>
                    <FooterCenterCol>
                        <FooterMenu>
                            {FooterItems.map((items) => {
                                return (
                                    <>
                                    <FooterLink to={items.url}>{items.title}</FooterLink>
                                    <Bar></Bar>
                                    </>
                                )
                            })}
                            <FooterA href="https://storyset.com/" target="_blank">Storyset Illustrations</FooterA>
                        </FooterMenu>
                    </FooterCenterCol>
                </Row>
                <Row>
                    <FooterCenterCol>
                        <FooterCopyright>
                            Copyright © Doxey-Hirota CoLab 2021, University of Waterloo Department of Biology. All rights reserved.
                        </FooterCopyright>
                    </FooterCenterCol>
                </Row>
            </Container>
        </Foot>
    )
}

export default Footer;