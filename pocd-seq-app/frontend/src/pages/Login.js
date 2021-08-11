import {useState} from "react"
import LoginImg from "../assets/LoginImg.svg"
import {Section} from '../components/PageElement'
import {Col, Container, Row} from 'react-bootstrap';
import {request} from "../http-common";

const Login = () => {
    const [login, setLogin] = useState({
        username: "",
        password: ""
    })

    const onChangeUsername = (e) => {
        setLogin({...login, username: e.target.value})
    }

    const onChangePassword = (e) => {
        setLogin({...login, password: e.target.value})
    }

    const loginRequest = (req) => {
        return request({
            url: "http://localhost:8080/token",
            method: "POST",
            body: new URLSearchParams(req),
        }, "application/x-www-form-urlencoded");
    }

    const handleLogin = (e) => {
        e.preventDefault();
        if (Object.values(login).some(o => o === "")) {
            console.log("MISSING PARAMETER")
        }

        const request = {
            username: login.username,
            password: login.password,
        };

        loginRequest(request)
            .then((response) => {
                localStorage.setItem("accessToken", response.access_token);
            })
            .catch((error) => {
                console.log("SOMETHING WENT WRONG LOL")
            });
    }

    return (
        <Section id="login">
            <Container>
                <Row className="loginRow">
                    <Col md={5} sm={8} className="login">
                        <form>
                            <div className="loginTitle">
                                <h3>Log In</h3>
                            </div>

                            <div className="form-group">
                                <label>Username</label>
                                <input type="username"
                                       className="form-control"
                                       placeholder="Enter username"
                                       onChange={onChangeUsername} />
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <input type="password"
                                       className="form-control"
                                       placeholder="Enter password"
                                       onChange={onChangePassword} />
                            </div>
                            <div className="loginBtnDiv">
                                <button type="submit"
                                        className="loginBtn"
                                        onClick={handleLogin}>Login
                                </button>
                            </div>
                            <p className="forgot-password">
                                Don't Have an Account
                                <a href="/signup">Sign Up</a>
                            </p>
                        </form>
                    </Col>
                    <Col className="loginContainer" md={{span: 6, offset: 1}}
                         sm={4}>
                        <div>
                            <img className="loginPicture" src={LoginImg}
                                 alt='loginImg' />
                        </div>
                    </Col>
                </Row>
            </Container>
        </Section>
    );
}

export default Login;