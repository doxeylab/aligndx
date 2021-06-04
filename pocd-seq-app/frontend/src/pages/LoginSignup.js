import React, {useState, useEffect} from "react";
import {Title, Section} from '../components/PageElement'

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

    useEffect(() => {}, [signUp])

    const onChangeEmail = (e) => {
        setSignUp({...signUp, email: e.target.value})
    }

    const onChangePassword = (e) => {
        setSignUp({...signUp, password: e.target.value})
    }

    const onChangeFirstName = (e) => {
        setSignUp({...signUp, first_name: e.target.value})
    }


    const onChangeLastName = (e) => {
        setSignUp({...signUp, last_name: e.target.value})
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
        <Section id="signup" center>
            <form style={{marginRight: "50px"}} onSubmit={handleSignUp}>
                <h3>Sign Up</h3>

                <div className="form-group">
                    <label>First name</label>
                    <input type="text" className="form-control" placeholder="First name" onChange={onChangeFirstName}/>
                </div>

                <div className="form-group">
                    <label>Last name</label>
                    <input type="text" className="form-control" placeholder="Last name" onChange={onChangeLastName}/>
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input type="email" className="form-control" placeholder="Enter email" onChange={onChangeEmail} />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="Enter password" onChange={onChangePassword}/>
                </div>

                <button type="submit" className="btn btn-dark btn-lg btn-block" onClick={handleSignUp}>Register</button>
                <p className="forgot-password text-right">
                    Already have an account? <a href="#">Login In</a>
                </p>
            </form>
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
                    Don't Have an Account <a href="#">Sign Up</a>
                </p>
            </form>
        </Section>
    );
}

export default SignUp