import React, { useState, useRef, useEffect } from "react";
import AuthService from "../Services/AuthService";
import Message from "../Message";
import "./RegisterLogin.css";

const Register = (props) => {
  // State Handles for the input fields
  const [user, setUser] = useState({ name: "", email: "", password: "" });
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
    setUser({ name: "", email: "", password: "" });
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
        <label htmlFor="name">Name: </label>
        <input
          type="text"
          name="name"
          onChange={onChange}
          className="form-control"
          placeholder="Enter your name"
          required
          value={user.name}
        />

        <label htmlFor="email">Email: </label>
        <input
          type="text"
          name="email"
          onChange={onChange}
          className="form-control"
          placeholder="Enter your email"
          required
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
          required
          value={user.password}
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
