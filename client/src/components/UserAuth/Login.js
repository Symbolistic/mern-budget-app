import React, { useState, useContext } from "react";
import AuthService from "../Services/AuthService";
import Message from "../Message";
import { AuthContext } from "../Context/AuthContext";
import "./RegisterLogin.css";

const Login = (props) => {
    // The reason I named it username and not email is because Passport Middleware only accepts username as a prop
	const [user, setUser] = useState({ username: "", password: "" });
	const [message, setMessage] = useState(null);
    const authContext = useContext(AuthContext);
    
    const onChange = event => {
        setUser({...user, [event.target.name]: event.target.value });   
    }

    const onSubmit = event => {
		event.preventDefault();
		
        AuthService.login(user).then(data => {
            const { isAuthenticated, user, message } = data;
            if(isAuthenticated) {
                authContext.setUser(user);
                authContext.setIsAuthenticated(isAuthenticated);
                props.history.push('/budget');
            }
            else 
                setMessage(message);
        });
	}
	
	const guestLogin = event => {
		event.preventDefault();
		const authData = {
			username: "test",
			password: "test123"
		}

        AuthService.login(authData).then(data => {
            const { isAuthenticated, user, message } = data;
            if(isAuthenticated) {
                authContext.setUser(user);
                authContext.setIsAuthenticated(isAuthenticated);
                props.history.push('/budget');
            }
            else 
                setMessage(message);
        });
	}

	return (
		<div className="register-login-page">
			<form className="form" onSubmit={onSubmit}>
				<h3>Please Sign In</h3>
				<label htmlFor="email">
					Email:{" "}
				</label>
				<input
					type="text"
					name="username"
					onChange={onChange}
					placeholder="Enter Email"
					required
				/>

				<label htmlFor="password">
					Password:
				</label>
				<input
					type="password"
					name="password"
					onChange={onChange}
					placeholder="Enter Password"
					required
				/>

				<button className="btn btn-lg btn-primary btn-block" type="submit">
					Log in
				</button>

				<button className="btn-guest" onClick={guestLogin}>
					Guest Login
				</button>

                <p className="message">Not registered? <a href="/register">Create an account</a></p>
				<br/>
				<p className="message"><a href="/forgot">Forgot Password</a></p>
			</form>
            {message ?  <Message message={message} /> : null}
		</div>
	);
};

export default Login;
