import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { TiAt, TiCog, TiKey } from "react-icons/ti";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import api from "../../config/api";
import { successToast, errorToast } from "../../utils/glamorStyles";
import logo from "../../assets/Logo.svg";

import "./styles.css";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");

  const history = useHistory();

  const handleReset = async (e) => {
    e.preventDefault();

    const data = {
      email,
      token,
      password,
    };

    try {
      await api.post("api/reset_password", data);

      toast.success("✔️Password changed!", successToast);
      history.push("/");
    } catch (error) {
      const errorMessage = error.response.data.message;

      //Muitos if's 😥, mas com o intuito de deixar a mensagem mais amigável!

      if (errorMessage.indexOf("empty") !== -1) {
        toast.error("🚨Fill in all the fields!", errorToast);
      } else if (errorMessage.indexOf("valid email") !== -1) {
        toast.error("❌Please, enter a valid email!", errorToast);
      } else if (errorMessage.indexOf("registered") !== -1) {
        toast.error("❌User not found!", errorToast);
      } else if (errorMessage.indexOf("Invalid token") !== -1) {
        toast.error("❌Invalid token!", errorToast);
      } else if (errorMessage.indexOf("Expired token") !== -1) {
        toast.error("⏱️Expired token!", errorToast);
      }
    }
  };

  return (
    <div className="container">
      <div className="view">
        <div className="reset-content">
          <img src={logo} alt="" />
          <p>Reset your password</p>
        </div>
        <form className="reset-form" onSubmit={handleReset}>
          <div className="input-container">
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
            <TiAt size={30} className="input-icon" />
          </div>
          <div className="input-container">
            <input
              type="text"
              placeholder="Token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="input"
            />
            <TiCog size={30} className="input-icon" />
          </div>
          <div className="input-container">
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
            <TiKey size={30} className="input-icon" />
          </div>
          <button type="submit" className="form-btn">
            Reset
          </button>
        </form>
      </div>
    </div>
  );
}
