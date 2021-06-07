import React, { useEffect } from 'react'
import Aos from "aos";
import { Link } from 'react-router-dom';
import OurGoals from '../assets/OurGoals.svg';
import DiversityImage from '../assets/DiversityImage.svg';
import blueWaveTop from '../assets/blueWaveTop.svg';
import blueWaveBottom from '../assets/blueWaveBottom.svg';

export default function About() {

    const scrollWin = () => {
        window.scrollTo(0, 0);
    };

    //Uses the Aos library//
    useEffect(() => {
        Aos.init({ duration: 2000, 
        once:true  
        });
    }, []);

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
                    <img className="blueWaveTop" draggable="false" src={blueWaveTop} alt='blueWaveTop' />
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
                    <img draggable="false" className="blueWaveBottom" src={blueWaveBottom} alt='blueWaveBottom' />
                </div>

                {/*Benefits Choosing Us*/}

                <div className="ourBenefit">
                    <div className="ourBenefitWrap">
                        <div className="ourBenefitTitle">
                            <h1>An Experience With Us Like No Other!</h1>
                        </div>
                        <div className="ourBenefitBody">
                            <h2>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ea, hic ipsa distinctio fugiat commodi aut voluptatem nesciunt maiores corrupti molestiae, est numquam dicta nemo.</h2>
                        </div>
                    </div>
                    <div className="ourBenefitSectionWrap">
                        <div data-aos="fade-up" className="ourBenefitCol">
                            <div  className="ourBenefitSection">
                                <div className="ourBenefitIcon"><i class="fas fa-users"></i></div>
                                <div className="ourBenefitSubTitle"><h3>Benefit 1</h3></div>
                                <div className="ourBenefitText"><p>Lorem ipsum dolor sit amet Tempora quae repudiandae, nisi eveniet quis vitae unde rerum magni deleniti.</p></div>
                            </div>
                            <div className="ourBenefitSection">
                                <div className="ourBenefitIcon"><i className="fas fa-users"></i></div>
                                <div className="ourBenefitSubTitle"><h3>Benefit 1</h3></div>
                                <div className="ourBenefitText"><p>Lorem ipsum dolor sit amet Tempora quae repudiandae, nisi eveniet quis vitae unde rerum magni deleniti.</p></div>
                            </div>
                            <div className="ourBenefitSection">
                                <div className="ourBenefitIcon"><i className="fas fa-users"></i></div>
                                <div className="ourBenefitSubTitle"><h3>Benefit 1</h3></div>
                                <div className="ourBenefitText"><p>Lorem ipsum dolor sit amet Tempora quae repudiandae, nisi eveniet quis vitae unde rerum magni deleniti.</p></div>
                            </div>
                        </div>
                        <div data-aos="fade-up" className="ourBenefitCol">
                            <div className="ourBenefitSection">
                                <div className="ourBenefitIcon"><i class="fas fa-users"></i></div>
                                <div className="ourBenefitSubTitle"><h3>Benefit 1</h3></div>
                                <div className="ourBenefitText"><p>Lorem ipsum dolor sit amet Tempora quae repudiandae, nisi eveniet quis vitae unde rerum magni deleniti.</p></div>
                            </div>
                            <div className="ourBenefitSection">
                                <div className="ourBenefitIcon"><i class="fas fa-users"></i></div>
                                <div className="ourBenefitSubTitle"><h3>Benefit 1</h3></div>
                                <div className="ourBenefitText"><p>Lorem ipsum dolor sit amet Tempora quae repudiandae, nisi eveniet quis vitae unde rerum magni deleniti.</p></div>
                            </div>
                            <div className="ourBenefitSection">
                                <div className="ourBenefitIcon"><i className="fas fa-users"></i></div>
                                <div className="ourBenefitSubTitle"><h3>Benefit 1</h3></div>
                                <div className="ourBenefitText"><p>Lorem ipsum dolor sit amet Tempora quae repudiandae, nisi eveniet quis vitae unde rerum magni deleniti.</p></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*Our Goals section*/}
                <div className="ourGoals" >
                    <div className="ourGoalsImageWrap">
                        <img className="ourGoalsImage" src={OurGoals} alt='OurGoalsImage' />
                    </div>

                    <div className="ourGoalsTextWrap">
                        <div className="ourGoalsText">
                            <h1>Our Goals</h1>
                            <h3>Lorem ipsum dolor, sit amet consectetur sit amet consectetur sit amet consectetur placeat!</h3>
                            <ul>
                                <li><p>Lorem ipsum dolor sit reiciendis alias obcaecati!</p></li>
                                <li><p>Lorem ipsum dolor sit reiciendis alias obcaecati!</p></li>
                                <li><p>Lorem ipsum dolor sit reiciendis alias obcaecati!</p></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/*Diversity section*/}
                <div className="ourDiversity" >
                    <div className="ourDiversityTextWrap">
                        <div className="ourDiversityText">
                            <h1>Team Diversity</h1>
                            <h3>Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            Accusamus mollitia cupiditate deleniti, error atque quod,
                            facere veritatis sequi enim aliquam tempore culpa rem cumque
                            quibusdam dolorum ullam porro doloremque ducimus.
                            </h3>
                            <h3>Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            Accusamus mollitia cupiditate deleniti, error atque quod,
                            facere veritatis sequi enim aliquam tempore culpa rem cumque
                            quibusdam dolorum ullam porro doloremque ducimus.
                            </h3>
                        </div>
                    </div>
                    <div className="ourDiversityImageWrap">
                        <img className="ourDiversityImage" src={DiversityImage} alt='DiversityImage' />
                    </div>
                </div>

                {/* Meet Our Team */}
                <div className="meetUs">
                    <div className="meetUsTitle">
                        <h1>Meet The People Behind This Project</h1>
                    </div>
                    <div className="meetUsBtn">
                        <Link to='/team' onClick={scrollWin}>
                            <div className="meetUsBtnWrap">
                                <div className="meetUsBtnText">Click Me</div>
                                <i className="fas fa-angle-double-right"></i>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div >
    );
}