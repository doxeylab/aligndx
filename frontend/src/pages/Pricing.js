import { useState } from "react";
import { Button, Container, Card } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { SendCheck, CheckCircleFill } from "react-bootstrap-icons";
import { Section } from "../components/Common/PageElement";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from "../context/AuthProvider";

const Pricing = () => {
  const navigate = useNavigate();
  const location = useLocation(); 

  const context = useAuthContext();
  const [basicPlan] = useState('Basic Plan');
  const [premiumPlan] = useState('Premium Plan');

  const styles = {
    button: {
      fontSize:"22px",
      borderRadius:"10px"
    },
    planType:{
      fontWeight:"bold",
      textAlign:"center",
      marginBottom:"1.5rem"
    },
    planPrice:{
      fontWeight:"bold",
      fontSize:"2.5rem"
    },
    planInfo:{
      fontWeight:"bold",
      fontSize:"1.5rem"
    },
   li:{
      marginBottom:"1rem"

    }

    
  }

  const linkToCheckout = (plan_name) => {
    if (!context.authenticated) {
      navigate("/signup", {state: {from: location}, replace: true})
    } else {
      navigate(`/checkout?plan_name=${plan_name}`)
    }
  }
  return (
    <>
      <Section center id="pricing">
        <Container>
          <div className="py-5">
            <Row>
              <Col className="text-center mb-5">
                <h2>Please select a plan below to continue.</h2>
              </Col>
            </Row>
            <Row>
              <Col
                sm={{ span: 10, offset: 1 }}
                md={{ span: 8, offset: 2 }}
                lg={{ span: 4, offset: 0 }}
                className="mb-5"
              >
                <Card className="p-5">
                  <Card.Header className="text-center">
                    <SendCheck color="DodgerBlue" size={96} />
                    <h1 className="" style={styles.planType}>Basic</h1>
                  </Card.Header>
                  <Card.Body className="text-center">
                    <div>
                      <span style={styles.planPrice}>$100</span>
                      <span className="h3">
                        / month
                      </span>
                    </div>
                    <ul className="list-unstyled my-5 text-left">
                      <li style={styles.li}>
                        <CheckCircleFill color="green" size={20} />
                        <span style={styles.planInfo}>
                          &nbsp;Up to 100GB
                        </span>
                      </li>
                      <li style={styles.li}>
                        <CheckCircleFill color="green" size={20} />
                        <span style={styles.planInfo}>
                          &nbsp;Description:
                        </span>
                      </li>
                    </ul>
                  </Card.Body>
                  <Card.Footer className="text-center">
                    <Button variant="primary" style={styles.button} onClick={() => linkToCheckout(basicPlan)}>
                      Join now
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
              <Col
                sm={{ span: 10, offset: 1 }}
                md={{ span: 8, offset: 2 }}
                lg={{ span: 4, offset: 0 }}
              >
                <Card className="p-5">
                  <Card.Header className="text-center">
                    <SendCheck color="DodgerBlue" size={96} />
                    <h1 className="" style={styles.planType}>Premium</h1>
                  </Card.Header>
                  <Card.Body className="text-center">
                    <div>
                    <span style={styles.planPrice}>$250</span>
                      <span className="h3">
                        / month
                      </span>
                    </div>
                    <ul className="list-unstyled my-5 text-left">
                      <li style={styles.li}>
                        <CheckCircleFill color="green" size={20} />
                        <span style={styles.planInfo}>
                          &nbsp;Up to 500GB
                        </span>
                      </li>
                      <li style={styles.li}>
                        <CheckCircleFill color="green" size={20} />
                        <span style={styles.planInfo}>
                          &nbsp;Description:
                        </span>
                      </li>
                    </ul>
                  </Card.Body>
                  <Card.Footer className="text-center">
                    <Button variant="primary" style={styles.button} onClick={() => linkToCheckout(premiumPlan)}>
                      Join now
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
              <Col
                sm={{ span: 10, offset: 1 }}
                md={{ span: 8, offset: 2 }}
                lg={{ span: 4, offset: 0 }}
              >
                <Card className="p-5">
                  <Card.Header className="text-center">
                    <SendCheck color="DodgerBlue" size={96} />
                    <h1 className="" style={styles.planType}>Custom Quote</h1>
                  </Card.Header>
                  <Card.Body className="text-center">
                    <div>
                    <span style={styles.planPrice}>Contact Us</span>
                    </div>
                    <ul className="list-unstyled my-5 text-left">
                      <li style={styles.li}>
                        <CheckCircleFill color="green" size={20} />
                        <span style={styles.planInfo}>
                          &nbsp;Unlimited Data
                        </span>
                      </li>
                      <li style={styles.li}>
                        <CheckCircleFill color="green" size={20} />
                        <span style={styles.planInfo}>
                          &nbsp;Description:
                        </span>
                      </li>
                    </ul>
                  </Card.Body>
                  <Card.Footer className="text-center">
                    <Button variant="primary" style={styles.button}>
                      Get a Quote
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </Section>
    </>
  );
};
export default Pricing;
