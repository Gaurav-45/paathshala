import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const API_ENDPOINT = process.env.REACT_APP_BACKEND_URL;

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = () => {
    axios
      .post(`${API_ENDPOINT}/api/login`, user)
      .then((response) => {
        toast.success("Log in successfull", {
          position: "bottom-center",
        });
        navigate("/");
        login(response);
      })
      .catch((error) => {
        toast.error(error.response.data.message, {
          position: "bottom-center",
        });
      });
  };
  return (
    <div className="login_container">
      <div className="login">
        <img className="sidebar_logo" src="./paathshala_logo.png" alt="" />
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
