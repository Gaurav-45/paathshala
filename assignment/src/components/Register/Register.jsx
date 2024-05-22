import React, { useState } from "react";
import "../Login/Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
const API_ENDPOINT = process.env.REACT_APP_BACKEND_URL;

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = () => {
    console.log(user);
    axios
      .post(`${API_ENDPOINT}/api/register`, user)
      .then((response) => {
        toast.success("Account created successfully", {
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
        <img className="sidebar_logo" src="./karmayogiLogo.png" alt="" />
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Enter Name"
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
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
          Already have an account?
          <Link to="/login">Sign-in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
