import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TiAt, TiKey } from "react-icons/ti";

import api from "../../config/api";
import { errorToast } from "../../utils/glamorStyles";
import logo from "../../assets/Logo.svg";

import "./styles.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const history = useHistory();

  const handleLogin = async e => {
    e.preventDefault();

    const data = {
      email,
      password
    }

    try {
      const response = await api.post("api/login", data);

      const { user, token } = response.data;

      localStorage.setItem("username", user.name);
      localStorage.setItem("user_img", user.user_img);
      localStorage.setItem("token", token);

      history.push("/home");
    } catch (error) {
      const errorMessage = error.response.data.message;

      if (errorMessage.indexOf("empty") !== -1) {
        toast.error("🚨Fill in all the fields!", errorToast);
      } else if (errorMessage.indexOf("valid email") !== -1) {
        toast.error("❌Please, enter a valid email!", errorToast);
      } else if (errorMessage.indexOf("registered") !== -1) {
        toast.error("❌User not found!", errorToast);
      } else if (errorMessage.indexOf("Wrong") !== -1) {
        toast.error("❌Wrong password!", errorToast);
      }
    }
  }

  return (
    <div className="container">
      <div className="view">
        <div className="login-content">
          <img src={logo} alt="" />
          <p>Enter to view all your contacts!</p>
        </div>
        <form className="login-form" onSubmit={handleLogin} >
          <div className="input-container">
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            <TiAt className="input-icon" size={30} />
          </div>
          <div className="input-container">
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <TiKey className="input-icon" size={30} />
          </div>

          <button className="form-btn" type="submit">
            Login
          </button>
        </form>
        <div className="login-utils">
          <Link to="/register" className="util-link">
            I don't have an account
          </Link>
          <Link to="/forgot_password" className="util-link">
            Forgot my password
          </Link>
        </div>
      </div>
    </div>
  );
}
