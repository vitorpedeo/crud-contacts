import React from "react";
import { Route, Redirect } from "react-router-dom";

export default function PrivateRoute(props) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("You need to login first!");
    return <Redirect to="/" />;
  }

  return <Route {...props} />;
}
