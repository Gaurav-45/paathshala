import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const API_ENDPOINT = process.env.REACT_APP_BACKEND_URL;
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = () => {
    console.log(user);
    axios
      .post(`${API_ENDPOINT}/api/login`, user)
      .then((response) => {
        window.alert("Log in successfull");
        navigate("/");
        login(response);
      })
      .catch((error) => {
        window.alert(error.response.data.message);
      });
  };
  return (
    <div className="login_container">
      <div className="login">
        <img className="sidebar_logo" src="./karmayogiLogo.png" alt="" />
        <input
          type="text"
          name="email"
          id="email"
          placeholder="Enter Email"
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <input
          type="password"
          name="pass"
          id="pass"
          placeholder="Enter password"
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />
        <button className="login_button" onClick={handleSubmit}>
          Login
        </button>
        <p className="register_text">
          Don't have account?
          <Link to="/register">Sign-up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;