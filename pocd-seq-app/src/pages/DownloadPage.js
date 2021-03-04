import React from 'react';
import { Container } from 'react-bootstrap';
import topLeftBackground from '../assets/topLeftBackground.svg';
import rightBackground from '../assets/rightBackground.svg'; 
import demo_video from '../assets/demo_video.mp4';
import { Button } from '../pages/DownloadAppBtn';

const DownloadPage = () => {
  return (
      <>
         <div className="download-page">
                <Container className="download-page-wrapper">

                    <h1 className="download-page-text">AlignDx on the Go!</h1>
                        <p>
                            Reprehenderit laboris elit est nostrud enim aute.Reprehenderit laboris elit est nostrud enim aute.Reprehenderit laboris elit est nostrud enim aute.
                        </p>
                            <video width="360" height="640" className="download-page-video"
                                autoPlay
                                loop
                                muted
                            >
                                <source src={demo_video} type="video/mp4"/>
                            </video>
                    
                    <Button />

                </Container>
                <img className="topLeftBackground" src={topLeftBackground} alt='topLeftBackground' />
                <img className="rightBackground" src={rightBackground} alt='rightBackground' />
            </div>
      </>
  );
}
 
export default DownloadPage;
