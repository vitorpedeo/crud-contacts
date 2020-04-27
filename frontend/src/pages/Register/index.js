import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  TiUser,
  TiDevicePhone,
  TiAt,
  TiKey,
  TiArrowLeft,
} from "react-icons/ti";

import PicInput from "../../components/PicInput";
import logo from "../../assets/Logo.svg";
import api from "../../config/api";
import { successToast, errorToast } from "../../utils/glamorStyles";

import "./styles.css";

export default function Register() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const history = useHistory();

  const handleRegister = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("user_img", image);
    formData.append("name", name);
    formData.append("phone_number", phoneNumber);
    formData.append("email", email);
    formData.append("password", password);

    try {
      await api.post("api/register", formData);

      toast.success("✔️Succesfully registered!", successToast);
      history.push("/");
    } catch (error) {
      const errorMessage = error.response.data.message;

      //Muitos if's 😥, mas com o intuito de deixar a mensagem mais amigável! 

      if (errorMessage.indexOf("Invalid file") !== -1) {
        toast.error("⛔Invalid file type!", errorToast);
      } else if (errorMessage.indexOf("empty") !== -1) {
        toast.error("🚨Fill in all the fields!", errorToast);
      } else if (errorMessage.indexOf("valid email") !== -1) {
        toast.error("❌Please, enter a valid email!", errorToast);
      } else {
        toast.error("❌Please, enter a valid number!", errorToast);
      }
      
    }
  };

  return (
    <div className="container">
      <div className="register-view">
        <Link to="/" className="link-to-login">
          {" "}
          <TiArrowLeft size={25} /> Back to login page{" "}
        </Link>
        <div className="register-content">
          <img src={logo} alt="" />
          <p>Register a new account</p>
        </div>
        <form
          className="register-form"
          encType="multipart/form-data"
          onSubmit={handleRegister}
        >
          <div className="wrapper">
            <div className="pic-component">
              <PicInput actualImage={setImage} />
            </div>
            <div className="all-inputs">
              <div className="input-container">
                <input
                  className="input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                />
                <TiUser size={30} className="input-icon" />
              </div>
              <div className="input-container">
                <input
                  className="input"
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Your Phone Number"
                />
                <TiDevicePhone size={30} className="input-icon" />
              </div>
              <div className="input-container">
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                />
                <TiAt size={30} className="input-icon" />
              </div>
              <div className="input-container">
                <input
                  className="input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
                <TiKey size={30} className="input-icon" />
              </div>
            </div>
          </div>
          <button type="submit" className="form-btn">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
