import React, { useState } from "react";
import { TiCamera } from "react-icons/ti";

import "./styles.css";

export default function PicInput({ actualImage }) {
  const [preview, setPreview] = useState("");

  const activateUpload = () => {
    document.getElementById("file-input").click();
  };

  const handleImage = (e) => {
    const selectedImage = e.target.files[0];

    if (!selectedImage) {
      alert("Please select an image!");
      setPreview("");
      return;
    }

    if (selectedImage.type.indexOf("image") === -1) {
      alert("Invalid file!");
      setPreview("");
      return;
    }

    actualImage(selectedImage);

    const selectedImageURL = URL.createObjectURL(selectedImage);
    setPreview(selectedImageURL);
  };

  return (
    <div className="pic-container" onClick={activateUpload}>
      <input type="file" id="file-input" accept="image/*" onChange={handleImage} />
      {preview ? <img src={preview} alt="" /> : <TiCamera size={60} />}
    </div>
  );
}
