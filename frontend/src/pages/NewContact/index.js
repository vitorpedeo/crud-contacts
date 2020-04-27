import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TiUser, TiDevicePhone, TiAt, TiArrowLeft } from "react-icons/ti";

import api from "../../config/api";
import PicInput from "../../components/PicInput";
import logo from "../../assets/Logo.svg";
import { successToast, errorToast } from "../../utils/glamorStyles";

import "./styles.css";

export default function Register() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const history = useHistory();
  const token = "Bearer " + localStorage.getItem("token");

  const handleNewContact = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("contact_img", image);
    formData.append("name", name);
    formData.append("phone_number", phoneNumber);
    formData.append("email", email);

    try {
      const response = await api.post("api/new_contact", formData, {
        headers: {
          authorization: token,
        },
      });

      toast.success(response.data.message, successToast);
      history.push("/home");
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
      <div className="new-contact-view">
        <Link to="/home" className="link-to-home">
          {" "}
          <TiArrowLeft size={25} /> Back to home page{" "}
        </Link>
        <div className="new-contact-content">
          <img src={logo} alt="" />
          <p>Register a new contact</p>
        </div>
        <form
          className="new-contact-form"
          onSubmit={handleNewContact}
          encType="multipart/form-data"
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
                  placeholder="Contact Name"
                />
                <TiUser size={30} className="input-icon" />
              </div>
              <div className="input-container">
                <input
                  className="input"
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Contact Phone Number"
                />
                <TiDevicePhone size={30} className="input-icon" />
              </div>
              <div className="input-container">
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Contact Email"
                />
                <TiAt size={30} className="input-icon" />
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
