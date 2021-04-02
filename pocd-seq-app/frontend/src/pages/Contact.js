import React from 'react';
import { Container } from 'react-bootstrap';

const Contact = () => {
    return (
        <div className="section">
            <div className="contact-container">
                <Container>
                    <div className="contactTitle">
                        <h1>Get in Touch!</h1>
                    </div>
                    <div className="contactWrap">
                        <h2>Have any concerns or questions? Get in touch and let us know how we can help!</h2>
                        <div className="contactInfoWrap">
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
                    </div>
                </Container>
            </div>
        </div>
    );
}

export default Contact;

