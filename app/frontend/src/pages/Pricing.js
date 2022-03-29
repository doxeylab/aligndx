import { Button, Container, Card } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { SendCheck, CheckCircleFill } from "react-bootstrap-icons";
import { Section } from '../components/Common/PageElement';
const Pricing = () => {
  return (
    <>
        <Section center id="login">
        <Container>
          <div className="py-5">
            <Row>
              <Col className="text-center">
                <h2>Analyze your data for free up to 1GB</h2>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card className="bg-white p-5 rounded-lg shadow">
                  <Card.Header className="text-center">
                    <SendCheck color="DodgerBlue" size={96} />
                    <h1 className="font-weight-bold mb-4">Basic</h1>
                  </Card.Header>
                  <Card.Body className="text-center">
                    <div>
                      <span className="h1 font-weight-bold">$100</span>
                      <span className="h3 font-weight-normal ml-2">
                        / month
                      </span>
                    </div>
                    <div className="custom-separator my-4 mx-auto bg-primary"></div>
                    <ul className="list-unstyled my-5 text-small text-left font-weight-normal">
                      <li className="mb-3">
                        <CheckCircleFill color="green" size={20} />
                        <span className="h4 font-weight-bold">&nbsp;Data:</span>
                        Up to 50 GB
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
                    <Button variant="primary" className="shadow rounded-pill">
                      Join Now
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
              <Col>
                <Card className="bg-white p-5 rounded-lg shadow">
                  <Card.Header className="text-center">
                    <SendCheck color="DodgerBlue" size={96} />
                    <h1 className="font-weight-bold mb-4">Premium</h1>
                  </Card.Header>
                  <Card.Body className="text-center">
                    <div>
                      <span className="h1 font-weight-bold">$1000</span>
                      <span className="h3 font-weight-normal ml-2">
                        / month
                      </span>
                    </div>
                    <div className="custom-separator my-4 mx-auto bg-primary"></div>
                    <ul className="list-unstyled my-5 text-small text-left font-weight-normal">
                      <li className="mb-3">
                        <CheckCircleFill color="green" size={20} />
                        <span className="h4 font-weight-bold">&nbsp;Data:</span>
                        Up to 500 GB
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
                    <Button variant="primary" className="shadow rounded-pill">
                      Join Now
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
              <Col>
                <Card className="bg-white p-5 rounded-lg shadow">
                  <Card.Header className="text-center">
                    <SendCheck color="DodgerBlue" size={96} />
                    <h1 className="font-weight-bold mb-4">Custom</h1>
                  </Card.Header>
                  <Card.Body className="text-center">
                    <div>
                      <span className="h1 font-weight-bold">Contact Us</span>
        
                    </div>
                    <div className="custom-separator my-4 mx-auto bg-primary"></div>
                    <ul className="list-unstyled my-5 text-small text-left font-weight-normal">
                      <li className="mb-3">
                        <CheckCircleFill color="green" size={20} />
                        <span className="h4 font-weight-bold">&nbsp;Data:</span>
                        Up to 50 GB
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
                    <Button variant="primary" className="shadow rounded-pill">
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
