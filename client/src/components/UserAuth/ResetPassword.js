import React, { useState } from "react";
import AuthService from "../Services/AuthService";
import Message from "../Message";
import "./RegisterLogin.css";

const ResetPassword = (props) => {
  // State Handles for the input fields
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  const onSubmit = (event) => {
    event.preventDefault();

    if (password === confirmPassword) {
      const info = {
        resetLink: props.match.params.id,
        newPass: password,
      };

      AuthService.resetPassword(info).then((data) => {
        const { message } = data;
        setMessage(message);
        setPassword("");
        setConfirmPassword("");
      });
    } else {
      setMessage({ msgBody: "Password and Confirm do not match" });
    }
  };

  return (
    <div className="register-login-page">
      <form className="form" onSubmit={onSubmit}>
        <h3>Enter your new password</h3>

        <label htmlFor="password">Password: </label>
        <input
          type="text"
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          className="form-control"
          placeholder="Enter new password"
          required
          value={password}
        />

        <label htmlFor="confirmPassword">Confirm Password: </label>
        <input
          type="text"
          name="confirmPassword"
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="form-control"
          placeholder="Confirm new password"
          required
          value={confirmPassword}
        />

        <button className="btn btn-lg btn-primary btn-block" type="submit">
          Send Link
        </button>
      </form>
      {message ? <Message message={message} /> : null}
    </div>
  );
};

export default ResetPassword;
