import React from "react";
import axios from "axios";
import makeToast from "../Toaster";
import { withRouter } from "react-router-dom";

export default withRouter(function LoginPage(props) {
  const emailRef = React.createRef();
  const passwordRef = React.createRef();

  const loginUser = () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    axios
      .post("http://localhost:8000/user/login", {
        email,
        password,
      })
      .then((response) => {
        makeToast("Success", response.data.message);
        localStorage.setItem("CC_Token", response.data.token);
        props.history.push("/dashboard");
        props.setupSocket();
      })
      .catch((err) => {
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message
        )
          makeToast("Error", err.response.data.message);
      });
  };

  return (
    <div className="card">
      <div className="cardHeader">Login</div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="email">Email :</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter email"
            ref={emailRef}
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="password">Password :</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter password"
            ref={passwordRef}
          />
        </div>
        <button onClick={loginUser}>Login</button>
      </div>
    </div>
  );
});
