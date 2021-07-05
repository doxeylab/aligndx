import react from "react"
import LoginImg from "../assets/LoginImg.svg"
import { Title, Section } from '../components/PageElement'
import { Container, Row, Col } from 'react-bootstrap';

const Login = () => {
    return (
        <Section id="login">
            <Container>
                <Row className="loginRow">
                    <Col md={5} sm={8} className="login">
                        <form>
                            <div className="loginTitle">
                                <h3>Login In</h3>
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" className="form-control" placeholder="Enter email" />
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <input type="password" className="form-control" placeholder="Enter password" />
                            </div>
                            <div className="loginBtnDiv">
                                <button type="submit" className="loginBtn">Login</button>
                            </div>
                            <p className="forgot-password">
                                Don't Have an Account <a href="/signup">Sign Up</a>
                            </p>
                        </form>
                    </Col>
                    <Col className="loginContainer" md={{ span: 6, offset: 1 }} sm={4}>
                        <div >
                            <img classname="loginPicture" src={LoginImg} alt='loginImg' />
                        </div>
                    </Col>
                </Row>
            </Container>
        </Section >
    );
}

export default Login;