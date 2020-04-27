import React from "react";
import { Route, Redirect } from "react-router-dom";

export default function RedirectToHomeRoute(props) {
   const token = localStorage.getItem("token");

   if (!token) {
      return <Route {...props} />
   }

   return <Redirect to="/home"  />
}