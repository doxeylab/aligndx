import React from 'react';
import topLeftBackground from '../assets/topLeftBackground.svg';
import rightBackground from '../assets/rightBackground.svg';
import { Container } from 'react-bootstrap';

const Footer = () => {
    return (  
        <>
        <Container>
            <section>
                <div className="contactTitle">
                    <h1>Contact Us</h1>
                    <p>
                      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum unde quisquam necessitatibus perferendis numquam eveniet voluptas. Quibusdam fuga fugit quis!
                    </p>
                </div>
                <div className="contactWrap">
                        <div className="contactBox">
                            <div className="contactIcon"><i class="fas fa-map-marker-alt"></i></div>
                            <div className="contactText">
                                <h3>Address</h3>
                                <p>200 University Ave W, Waterloo, ON N2L 3G1</p>
                            </div>
                        </div>
                        <div className="contactBox">
                            <div className="contactIcon"><i class="fas fa-phone"></i></div>
                            <div className="contactText">
                                <h3>Phone</h3>
                                <p>519-888-4567</p>
                            </div>
                        </div>
                        <div className="contactBox">
                            <div className="contactIcon"><i class="fas fa-envelope"></i></div>
                            <div className="contactText">
                                <h3>Email</h3>
                                <p>acdoxey@uwaterloo.ca</p>
                            </div>
                        </div>
                </div> 
            </section>
            </Container>
            <img className="topLeftBackground" src={topLeftBackground} alt='topLeftBackground' />
            <img className="rightBackground" src={rightBackground} alt='rightBackground' />
        </>
    );
}
 
export default Footer;

