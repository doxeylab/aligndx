import React, { useState, useEffect } from "react";
import { Title, Section } from '../components/PageElement'
import SignUpImg from "../assets/SignUpImg.svg"
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

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
        name: "",
        username: "",
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

    const onChangeName = (e) => {
        setSignUp({ ...signUp, name: e.target.value })
    }


    const onChangeUsername = (e) => {
        setSignUp({ ...signUp, username: e.target.value })
    }

    const signup = (signupRequest) => {
        return request({
            url: "http://localhost:8080/create_user",
            method: "POST",
            body: JSON.stringify(signupRequest),
        });
    }

    const handleSignUp = (e) => {
        e.preventDefault();
        if (Object.values(signUp).some(o => o === "")) {
            console.log("MISSING PARAMETER")
        }

        const signupRequest = {
            name: signUp.name,
            username: signUp.username,
            email: signUp.email,
            password: signUp.password,
        };

        signup(signupRequest)
            .then((response) => {
                localStorage.setItem("accessToken", response.accessToken);
                // this.setState({ loading: false });
                // this.props.loadCurrentUser("SIGNUP");
                // this.props.router.back();
                console.log("YAY")
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
                                    <label>Username</label>
                                    <input type="text" className="form-control" placeholder="Username" onChange={onChangeUsername} />
                                </div>

                                <div className="form-group">
                                    <label>Name</label>
                                    <input type="text" className="form-control" placeholder="Name" onChange={onChangeName} />
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