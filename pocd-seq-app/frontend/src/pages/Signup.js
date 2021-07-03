import React, { useState, useEffect } from "react";
import { Title, Section } from '../components/PageElement'
import SignUpImg from "../assets/SignUpImg.svg"
import { Container, Row, Col } from 'react-bootstrap';

const request = (options) => {
    const headers = new Headers({
        "Content-Type": "application/json",
    });

    if (localStorage.getItem("accessToken")) {
        headers.append("Authorization", "Bearer " + localStorage.getItem("accessToken"));
    }

    const defaults = { headers: headers };
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options).then((response) =>
        response.json().then((json) => {
            if (!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
};

const SignUp = () => {
    const [signUp, setSignUp] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: ""
    })

    useEffect(() => { }, [signUp])

    const onChangeEmail = (e) => {
        setSignUp({ ...signUp, email: e.target.value })
    }

    const onChangePassword = (e) => {
        setSignUp({ ...signUp, password: e.target.value })
    }

    const onChangeFirstName = (e) => {
        setSignUp({ ...signUp, first_name: e.target.value })
    }


    const onChangeLastName = (e) => {
        setSignUp({ ...signUp, last_name: e.target.value })
    }

    const signup = (signupRequest) => {
        return request({
            url: "http://localhost:8080/auth/signup",
            method: "POST",
            body: JSON.stringify(signupRequest),
        });
    }

    const handleSignUp = (e) => {
        e.preventDefault();
        if (!Object.values(signUp).some(o => o === "")) {
            console.log("MISSING PARAMETER")
        }

        const signupRequest = {
            first_name: signUp.first_name,
            last_name: signUp.last_name,
            email: signUp.email,
            password: signUp.password,
        };

        signup(signupRequest)
            .then((response) => {
                localStorage.setItem("accessToken", response.accessToken);
                // this.setState({ loading: false });
                // this.props.loadCurrentUser("SIGNUP");
                // this.props.router.back();
            })
            .catch(() => {
                console.log("SOMETHING WENT WRONG LOL")
            });
    }
    return (
        <Section id="signup" >
            <Container>
                <Row className="signUpRow">
                    <Col md={5} sm={8} className="signUp">
                        <form onSubmit={handleSignUp}>
                            <div className="signUpTitle">
                                <h3>Sign Up Now</h3>
                            </div>

                            <div className="form-group-container">

                                <div className="form-group">
                                    <label>First name</label>
                                    <input type="text" className="form-control" placeholder="First name" onChange={onChangeFirstName} />
                                </div>

                                <div className="form-group">
                                    <label>Last name</label>
                                    <input type="text" className="form-control" placeholder="Last name" onChange={onChangeLastName} />
                                </div>

                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" className="form-control" placeholder="Enter email" onChange={onChangeEmail} />
                                </div>

                                <div className="form-group">
                                    <label>Password</label>
                                    <input type="password" className="form-control" placeholder="Enter password" onChange={onChangePassword} />
                                </div>
                            </div>
                            <div className="signUpBtnDiv">
                            <button type="submit" className="signUpBtn" onClick={handleSignUp}>Sign Up</button>
                            </div>
                            <p className="forgot-password">
                                Already have an account? <a href="/login">Login In</a>
                            </p>
                        </form>
                    </Col>
                    <Col className="signUpContainer" md={{ span: 6, offset: 1 }} sm={4}> 
                        <div >
                            <img classname="signUpPicture" src={SignUpImg} alt='SignUpImg' />
                        </div>
                    </Col>
                </Row>
            </Container>
        </Section>
    );
}

export default SignUp;