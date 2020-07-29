import React, { useState, useRef, useEffect } from "react";
import AuthService from "../Services/AuthService";
import Message from "../Message";
import "./RegisterLogin.css";

const Register = (props) => {
	const [user, setUser] = useState({ username: "", password: "", role: "" });
	const [message, setMessage] = useState(null);
	let timerID = useRef(null);

	useEffect(() => {
		return () => {
			clearTimeout(timerID);
		};
	}, []);

	const onChange = (event) => {
		setUser({ ...user, [event.target.name]: event.target.value });
	};

	const resetForm = () => {
		setUser({ name: "", email: "", password: "", role: "" });
	};

	const onSubmit = (event) => {
		event.preventDefault();
		AuthService.register(user).then((data) => {
			const { message } = data;
			setMessage(message);
			resetForm();
			if (!message.msgError) {
				timerID = setTimeout(() => {
					props.history.push("/login");
				}, 2000);
			}
		});
	};

	return (
		<div className="register-login-page">
			<form className="form" onSubmit={onSubmit}>
				<h3>Please Register</h3>
				<label htmlFor="name">
					Name:{" "}
				</label>
				<input
					type="text"
					name="name"
					onChange={onChange}
					className="form-control"
					placeholder="Enter your name"
					value={user.name}
				/>

				<label htmlFor="email">
					Email:{" "}
				</label>
				<input
					type="text"
					name="email"
					onChange={onChange}
					className="form-control"
					placeholder="Enter your email"
					value={user.email}
				/>

				<label htmlFor="password" className="sr-only">
					Password:
				</label>
				<input
					type="password"
					name="password"
					onChange={onChange}
					className="form-control"
					placeholder="Enter Password"
					value={user.password}
				/>

				<label htmlFor="role" className="sr-only">
					Role:
				</label>
				<input
					type="text"
					name="role"
					onChange={onChange}
					className="form-control"
					placeholder="Enter Role (admin/user)"
					value={user.role}
				/>

				<button className="btn btn-lg btn-primary btn-block" type="submit">
					Register
				</button>
			</form>
			{message ? <Message message={message} /> : null}
		</div>
	);
};

export default Register;
