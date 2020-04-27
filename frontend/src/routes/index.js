import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Register from "../pages/Register";
import Home from "../pages/Home";
import NewContact from "../pages/NewContact";
import NotFound from "../pages/NotFound";

import PrivateRoute from "../components/PrivateRoute";
import RedirectToHomeRoute from "../components/RedirectToHomeRoute";

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <RedirectToHomeRoute exact path="/" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/forgot_password" component={ForgotPassword} />
        <Route path="/reset_password" component={ResetPassword} />
        <PrivateRoute path="/home" component={Home} />
        <PrivateRoute path="/new_contact" component={NewContact} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}
