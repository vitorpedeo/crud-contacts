import React, { useState } from "react";
import { toast } from "react-toastify";
import { TiAt } from "react-icons/ti";

import logo from "../../assets/Logo.svg";
import { successToast, errorToast } from "../../utils/glamorStyles";
import api from "../../config/api";

import "./styles.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleEmailSubmission = async (e) => {
    e.preventDefault();

    try {
      await api.post("api/forgot_password", { email });

      toast.success("📧Email sent, folow its instructions!", successToast);
    } catch (error) {
      const errorMessage = error.response.data.message;

      if (errorMessage.indexOf("empty") !== -1) {
        toast.error("🚨Fill in all the fields!", errorToast);
      } else if (errorMessage.indexOf("valid email") !== -1) {
        toast.error("❌Please, enter a valid email!", errorToast);
      } else {
        toast.error("❌User not found!", errorToast);
      }
    }
  };

  return (
    <div className="container">
      <div className="view">
        <div className="forgot-content">
          <img src={logo} alt="" />
          <p>We'll send your password to this email!</p>
        </div>
        <form className="forgot-form" onSubmit={handleEmailSubmission}>
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

          <button className="form-btn" type="submit">
            Confirm
          </button>
        </form>
      </div>
    </div>
  );
}
