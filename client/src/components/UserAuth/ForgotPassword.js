import React, { useState, useRef, useEffect } from "react";
import AuthService from "../Services/AuthService";
import Message from "../Message";
import "./RegisterLogin.css";

const ForgotPassword = (props) => {
	
	// State Handles for the input fields
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState(null);


	const onSubmit = (event) => {
        event.preventDefault();
        
		AuthService.forgotPassword({email: email}).then((data) => {
			const { message } = data;
			setMessage(message);
			setEmail('');
		});
	};

	return (
		<div className="register-login-page">
			<form className="form" onSubmit={onSubmit}>
				<h3>Enter your email</h3>

				<label htmlFor="email">
					Email:{" "}
				</label>
				<input
					type="text"
					name="email"
					onChange={event => setEmail(event.target.value)}
					className="form-control"
					placeholder="Enter your email"
					required
					value={email}
				/>

				<button className="btn btn-lg btn-primary btn-block" type="submit">
					Send Link
				</button>
			</form>
			{message ? <Message message={message} /> : null}
		</div>
	);
};

export default ForgotPassword;
