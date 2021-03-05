import React, { useState } from 'react'
import topLeftBackground from '../assets/topLeftBackground.svg';
import rightBackground from '../assets/rightBackground.svg';
import Art from '../assets/Art.png';
import { Container, Row, Col } from 'react-bootstrap';
import FileUpload from "../components/FileUpload";
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
    const [toggleUploadModal, setToggleUploadModal] = useState(false)
    const [toggleLoader, setToggleLoader] = useState(false)

    const callback = () => {
        setToggleUploadModal(false)
      }

    const spinnerCallback = (loaderState) => {
        setToggleLoader(loaderState)
    }

    return (
        <>
            <div className="home">
                <Container>
                    <Row className="home-wrapper">
                        <Col md={6} sm={12}>
                            <div className="home-wrapper__info">
                                <h1 className="home-wrapper__info-title">GENOME<br/>SEQUENCING</h1>
                                <p className="home-wrapper__info-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis elit eu nulla accumsan, ac rutrum mauris maximus. Sed lobortis, urna eget porttitor laoreet, sapien eros egestas mi, id iaculis arcu libero ut massa.</p>
                                <button className="cta-btn--analyze" onClick={(e) => {e.preventDefault(); setToggleUploadModal(!toggleUploadModal);}}>Analyze Now</button>
                            </div>
                        </Col>
                        <Col md={6} sm={12}>
                            <div className="home-wrapper__image">
                                <img className="Art" src={Art} alt="Art" style={{width: 350}}/>
                            </div>
                        </Col>
                    </Row>
                </Container>
                <img className="topLeftBackground" src={topLeftBackground} alt='topLeftBackground' />
                <img className="rightBackground" src={rightBackground} alt='rightBackground' />
            </div>
            <FileUpload closeSpinnerCallback={spinnerCallback} parentCallback={callback} show={toggleUploadModal} modalToggle={(e) => {e.preventDefault(); setToggleUploadModal(!toggleUploadModal);}} />
            {toggleLoader?<LoadingSpinner /> : ''}
        </>
    );
  }
   
export default Home;