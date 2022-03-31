import { Button, Container, Card } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { SendCheck, CheckCircleFill } from "react-bootstrap-icons";
import { Section } from "../components/Common/PageElement";


const Pricing = () => {
  const styles = {
    button: {
      fontSize:"22px",
      borderRadius:"10px"
    }
  }
  return (
    <>
      <Section center id="pricing">
        <Container>
          <div className="py-5">
            <Row>
              <Col className="text-center mb-5">
                <h2>Analyze your data for free up to 1GB</h2>
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
                    <h1 className="font-weight-bold mb-4">Basic</h1>
                  </Card.Header>
                  <Card.Body className="text-center">
                    <div>
                      <span className="h1 font-weight-bold">$100</span>
                      <span className="h3">
                        / month
                      </span>
                    </div>
                    <ul className="list-unstyled my-5 text-left">
                      <li className="mb-3">
                        <CheckCircleFill color="green" size={20} />
                        <span className="h4 font-weight-bold">
                          &nbsp;Up to 100GB
                        </span>
                      </li>
                      <li className="mb-3">
                        <CheckCircleFill color="green" size={20} />
                        <span className="h4 font-weight-bold">
                          &nbsp;Description:
                        </span>
                      </li>
                    </ul>
                  </Card.Body>
                  <Card.Footer className="text-center">
                    <Button variant="primary" style={styles.button}>
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
                    <h1 className="font-weight-bold mb-4">Premium</h1>
                  </Card.Header>
                  <Card.Body className="text-center">
                    <div>
                      <span className="h1 font-weight-bold">$150</span>
                      <span className="h3">
                        / month
                      </span>
                    </div>
                    <ul className="list-unstyled my-5 text-left">
                      <li className="mb-3">
                        <CheckCircleFill color="green" size={20} />
                        <span className="h4 font-weight-bold">
                          &nbsp;Up to 500GB
                        </span>
                      </li>
                      <li className="mb-3">
                        <CheckCircleFill color="green" size={20} />
                        <span className="h4 font-weight-bold">
                          &nbsp;Description:
                        </span>
                      </li>
                    </ul>
                  </Card.Body>
                  <Card.Footer className="text-center">
                    <Button variant="primary" style={styles.button}>
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
                    <h1 className="font-weight-bold mb-4">Custom Quote</h1>
                  </Card.Header>
                  <Card.Body className="text-center">
                    <div>
                      <span className="h1 font-weight-bold">Contact Us</span>
                    </div>
                    <ul className="list-unstyled my-5 text-left">
                      <li className="mb-3">
                        <CheckCircleFill color="green" size={20} />
                        <span className="h4 font-weight-bold">
                          &nbsp;Unlimited Data
                        </span>
                      </li>
                      <li className="mb-3">
                        <CheckCircleFill color="green" size={20} />
                        <span className="h4 font-weight-bold">
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
