import React from "react";
import { toast } from "react-toastify";

import Routes from "./routes";

import "./global.css";

toast.configure({
  autoClose: 3000
});

function App() {
  return <Routes />;
}

export default App;
