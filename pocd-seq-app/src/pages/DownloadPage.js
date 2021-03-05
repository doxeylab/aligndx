import React from 'react';
import { Container } from 'react-bootstrap';
import topLeftBackground from '../assets/topLeftBackground.svg';
import rightBackground from '../assets/rightBackground.svg'; 
import demo_video from '../assets/demo_video.mp4';


const DownloadPage = () => {
  return (
      <>
         <div className="download-page">
                <Container className="download-page-main">

                    <div className ="download-page-wrapper">

                        <h1 >Take the Sequencing with you!</h1>
                            <p>
                                Fast and Accurate LFIA Image Analysis
                            </p>
                            
                        <a href="https://play.google.com/store">
                            <button className='btn--download' >Download App</button>
                        </a>
                    </div>
                        <video width="360" height="640" className="download-page-video"
                            autoPlay
                            loop
                            muted
                        >
                            <source src={demo_video} type="video/mp4"/>
                        </video>

                </Container>
                <img className="topLeftBackground" src={topLeftBackground} alt='topLeftBackground' />
                <img className="rightBackground" src={rightBackground} alt='rightBackground' />
            </div>
      </>
  );
}
 
export default DownloadPage;
