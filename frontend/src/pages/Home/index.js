import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CSSTransition } from "react-transition-group";
import {
  TiArrowSortedDown,
  TiPlus,
  TiPencil,
  TiTrash,
  TiTimes,
} from "react-icons/ti";

import api from "../../config/api";
import logo from "../../assets/Logo.svg";
import { successToast, errorToast } from "../../utils/glamorStyles";
import PicInput from "../../components/PicInput";

import "./styles.css";
import "./modal.css";

export default function Home() {
  const [showDropDown, setShowDropDown] = useState(false);
  const [contacts, setContacts] = useState([]);

  const history = useHistory();

  const token = "Bearer " + localStorage.getItem("token");
  const firstName = localStorage.getItem("username").split(" ")[0];
  const userImg = localStorage.getItem("user_img");
  const imgPath = `http://localhost:5000/${userImg}`;

  //Configuração/states do Modal
  Modal.setAppElement("#root");

  const [isModalOpen, setIsOpen] = useState(false);

  const [imageUpdate, setImageUpdate] = useState(null);
  const [idUpdate, setIdUpdate] = useState("");
  const [nameUpdate, setNameUpdate] = useState("");
  const [phoneNumberUpdate, setPhoneNumberUpdate] = useState("");
  const [emailUpdate, setEmailUpdate] = useState("");

  const openModal = (id) => {
    const contactUpdate = contacts.find((contact) => contact.id === id);

    setIdUpdate(contactUpdate.id);
    setNameUpdate(contactUpdate.name);
    setPhoneNumberUpdate(contactUpdate.phone_number);
    setEmailUpdate(contactUpdate.email);

    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  //

  useEffect(() => {
    api
      .get("api/list_contacts", {
        headers: {
          authorization: token,
        },
      })
      .then((response) => setContacts(response.data))
      .catch((err) => {
        alert("Session expired. Login again!");
        history.push("/");
      });
  }, [token, history]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("contact_img", imageUpdate);
    formData.append("name", nameUpdate);
    formData.append("phone_number", phoneNumberUpdate);
    formData.append("email", emailUpdate);

    try {
      const response = await api.put(
        `api/update_contact/${idUpdate}`,
        formData,
        {
          headers: {
            authorization: token,
          },
        }
      );

      /**
       * Update manual dos contacts
       * Com isso não é necessário dar reload na página para ver as alterações
       */

      const contactUpdated = response.data.contact_updated;
      const idToUpdate = contacts.findIndex(
        (contact) => contact.id === idUpdate
      );

      contacts[idToUpdate].contact_img = contactUpdated.contact_img;
      contacts[idToUpdate].name = contactUpdated.name;
      contacts[idToUpdate].phone_number = contactUpdated.phone_number;
      contacts[idToUpdate].email = contactUpdated.email;

      setContacts(contacts);

      /**
       * Termina aqui o update manual 😃
       */

      toast.success(response.data.message, successToast);
      setIsOpen(false);
    } catch (error) {
      const errorMessage = error.response.data.message;

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

  const deleteContact = async (id) => {
    try {
      const response = await api.delete(`api/delete_contact/${id}`, {
        headers: {
          authorization: token,
        },
      });

      toast.success(response.data.message, successToast);

      setContacts(contacts.filter((contact) => contact.id !== id));
    } catch (error) {
      toast.error(error.response.data.message, errorToast);
    }
  };

  const logout = () => {
    localStorage.clear();
    history.push("/");
  };

  return (
    <div className="home-container">
      <CSSTransition
        in={showDropDown}
        timeout={200}
        classNames="dropdown"
        unmountOnExit
      >
        <div className="drop-down" onClick={logout}>
          <p>Logout</p>
        </div>
      </CSSTransition>

      <header className="home-header">
        <img src={logo} alt="" />
        <Link to="/new_contact" className="link-to-new">
          <span>New Contact</span> <TiPlus size={20} />{" "}
        </Link>
        <div className="profile-info">
          <p>Welcome, {firstName}!</p>
          <div className="profile-pic">
            <img src={imgPath} alt="" />
          </div>
          <TiArrowSortedDown
            className="drop-icon"
            size={30}
            onClick={() => setShowDropDown(!showDropDown)}
          />
        </div>
      </header>

      <div className="home-content">
        {contacts.length === 0 ? (
          <h2 className="empty-title" >Hey {firstName}, add some contacts!</h2>
        ) : (
          <table>
          <thead>
            <tr>
              <th colSpan="2">Name</th>
              <th>Phone Number</th>
              <th>Email</th>
            </tr>
          </thead>

          {contacts.map((contact) => (
            <tbody key={contact.id}>
              <tr>
                <td>
                  <div className="contact-photo">
                    <img
                      src={`http://localhost:5000/${contact.contact_img}`}
                      alt=""
                    />
                  </div>
                </td>
                <td>{contact.name}</td>
                <td>{contact.phone_number}</td>
                <td>{contact.email}</td>
                <td>
                  <button
                    type="button"
                    className="btn-operation"
                    onClick={() => openModal(contact.id)}
                  >
                    <TiPencil size={30} />
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn-operation"
                    onClick={() => deleteContact(contact.id)}
                  >
                    <TiTrash size={30} />
                  </button>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
        )}

        {/* {<table>
          <thead>
            <tr>
              <th colSpan="2">Name</th>
              <th>Phone Number</th>
              <th>Email</th>
            </tr>
          </thead>

          {contacts.map((contact) => (
            <tbody key={contact.id}>
              <tr>
                <td>
                  <div className="contact-photo">
                    <img
                      src={`http://localhost:5000/${contact.contact_img}`}
                      alt=""
                    />
                  </div>
                </td>
                <td>{contact.name}</td>
                <td>{contact.phone_number}</td>
                <td>{contact.email}</td>
                <td>
                  <button
                    type="button"
                    className="btn-operation"
                    onClick={() => openModal(contact.id)}
                  >
                    <TiPencil size={30} />
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn-operation"
                    onClick={() => deleteContact(contact.id)}
                  >
                    <TiTrash size={30} />
                  </button>
                </td>
              </tr>
            </tbody>
          ))}
        </table>} */}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="modal view"
        overlayClassName="overlay"
      >
        <div className="btn-modal-container">
          <button type="button" className="btn-modal" onClick={closeModal}>
            <TiTimes size={30} />
          </button>
        </div>

        <div className="modal-content">
          <img src={logo} alt="" />
          <p>Update your contact</p>
        </div>

        <form
          className="modal-form"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >
          <div className="modal-wrapper">
            <div className="modal-pic-component">
              <PicInput actualImage={setImageUpdate} />
            </div>

            <div className="modal-all-inputs">
              <div className="input-container">
                <input
                  type="text"
                  className="input"
                  value={nameUpdate}
                  onChange={(e) => setNameUpdate(e.target.value)}
                  placeholder="Contact Name"
                />
              </div>
              <div className="input-container">
                <input
                  type="text"
                  className="input"
                  value={phoneNumberUpdate}
                  onChange={(e) => setPhoneNumberUpdate(e.target.value)}
                  placeholder="Contact Phone Number"
                />
              </div>
              <div className="input-container">
                <input
                  type="email"
                  className="input"
                  value={emailUpdate}
                  onChange={(e) => setEmailUpdate(e.target.value)}
                  placeholder="Contact Email"
                />
              </div>
            </div>
          </div>
          <button type="submit" className="form-btn">
            Update
          </button>
        </form>
      </Modal>
    </div>
  );
}
