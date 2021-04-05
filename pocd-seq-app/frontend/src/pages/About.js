import React from 'react';
import OurGoals from '../assets/OurGoals.svg';
import blueWaveTop from '../assets/blueWaveTop.svg';
import blueWaveBottom from '../assets/blueWaveBottom.svg';

export default function About() {
    return (
        <div className="section">
            <div className="about-container">

                {/*About Us section*/}
                <div className="aboutUs">
                    <div className="aboutUsTitle">
                        <h1>Who We Are</h1>
                    </div>
                    <div className="aboutUsBody">
                        <h2>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora, maiores sunt quas aut
                            doloribus praesentium perspiciatis itaque. Blanditiis non minus ducimus autem hic recusandae
                            rem debitis eos!
                            </h2>
                    </div>
                </div>
                {/*Our Values section*/}
                <div className="ourValue">
                
                <img className="blueWaveTop" src={blueWaveTop} alt='blueWaveTop' />
                
                    <div className="ourValueWrap">
                    
                        <div className="ourValueTitle">
                            <h1>Our</h1>
                            <h1>Values</h1>
                        </div>
                        <div className="ourValueBodyWrap">
                            <div className="valueBoxCol">
                                <div className="valueBox">
                                    <h2>Commitment</h2>
                                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Consequuntur necessitatibus voluptate temporibus ea provident error. Error minus corporis rem commodi in tempora aut. </p>
                                </div>
                                <div className="valueBox">
                                    <h2>Commitment</h2>
                                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Consequuntur necessitatibus voluptate temporibus ea provident error. Error minus corporis rem commodi in tempora aut. </p>
                                </div>
                            </div>
                            <div className="valueBoxCol">
                                <div className="valueBox">
                                <h2>Commitment</h2>
                                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Consequuntur necessitatibus voluptate temporibus ea provident error. Error minus corporis rem commodi in tempora aut. </p>
                                </div>
                                <div className="valueBox">
                                <h2>Commitment</h2>
                                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Consequuntur necessitatibus voluptate temporibus ea provident error. Error minus corporis rem commodi in tempora aut. </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <img className="blueWaveBottom" src={blueWaveBottom} alt='blueWaveBottom' />
                </div>

                {/*Our Goals section*/}
                <div className="ourGoals" >
                    <div className="ourGoalsImageWrap">
                        <img src={OurGoals} alt='OurGoalsImage' />
                    </div>

                    <div className="ourGoalsText">
                        <h1>Our Goals</h1>
                        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facere nisi magnam sed quaerat, sint explicabo quis possimus nesciunt nostrum, sapiente enim nam et voluptatibus corrupti illo illum doloribus sit placeat!</p>
                    </div>
                </div>
                {/*Company Updates section*/}
                <div className="companyUpdates">
                    <div className="companyUpdatesWrapper">
                        <div className="companyUpdatesTitle">
                            <h1>Company Updates!</h1>
                        </div>
                        <div className="companyUpdatesContent">
                            <div className="companyUpdatesAnnouncements">
                                <h2>Announcements</h2>
                                <p>Lorem ipsum dolor siolorem, odio animi cumque tempore blanditiis necessitatibus minus voluptatum at maxime</p>
                                {/*eslint-disable-next-line*/}
                                <a href="javascript:void(0);">Learn More</a>
                            </div>
                            <div className="companyUpdatesSocial">
                                <h2>Follow Us</h2>
                                <p>Lorem ipsum dolor, coillum iure aliquid? Sunt consequatur debitis ipsum tempore!</p>
                                <div className="companyUpdatesBox">
                                    <div className="companyUpdatesIcon"><i class="fab fa-facebook-f"></i></div>
                                    <div className="companyUpdatesIcon"><i class="fab fa-youtube"></i></div>
                                    <div className="companyUpdatesIcon"><i class="fab fa-github"></i></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div >
    );
}