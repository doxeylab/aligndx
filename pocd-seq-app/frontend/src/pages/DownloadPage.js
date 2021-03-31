import React from 'react';
import { Container } from 'react-bootstrap';
import demo_video from '../assets/demo_video.mp4';

const DownloadPage = () => {
    return (
        <div className="section">
            <div className="downloadPage-container">
                <Container>
                    <div className="downloadPageTitle">
                        <h1 >Take the Sequencing with you!</h1>
                    </div>
                    <div className="downloadPageWrap">
                        <div className="downloadPageBody">
                            <h2>Fast and Accurate LFIA Image Analysis</h2>
                        </div>
                        <div className="downloadPageVideo">
                            <video width="360" height="auto" className="download-page-video"
                                autoPlay
                                loop
                                muted
                            >
                                <source src={demo_video} type="video/mp4" />
                            </video>
                        </div>
                        <div className="downloadPageBtnRow">
                            <a href="https://play.google.com/store">
                                <button className="downloadPageBtn" >Download App</button>
                            </a>
                        </div>
                    </div>
                </Container>
            </div>
        </div>
    );
}

export default DownloadPage;
