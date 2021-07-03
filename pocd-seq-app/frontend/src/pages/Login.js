import react from "react"
import SignUpImg from "../assets/SignUpImg.svg"
import { Title, Section } from '../components/PageElement'
import { Container, Row, Col } from 'react-bootstrap';

const Login = () => {
    return (
        <Section id="login">
            <Container>
                <Row className="loginRow">
                    <Col md={5} sm={8} className="loginIn">
                        <form>
                            <h3>Login In</h3>

                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" className="form-control" placeholder="Enter email" />
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <input type="password" className="form-control" placeholder="Enter password" />
                            </div>
                            <button type="submit" className="btn btn-dark btn-lg btn-block">Login</button>
                            <p className="forgot-password text-right">
                                Don't Have an Account <a href="/signup">Sign Up</a>
                            </p>
                        </form>
                    </Col>
                    <Col className="signUpContainer" md={{ span: 6, offset: 1 }} sm={4}> 
                    </Col>
                </Row>
            </Container>
        </Section >
    );
}

export default Login;