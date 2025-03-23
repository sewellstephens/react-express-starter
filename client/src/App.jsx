import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { XIcon } from "lucide-react";

import "./index.css";

//pages
import Home from "./pages/index";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Logout from "./pages/logout";
import Dashboard from "./pages/dashboard";
import Account from "./pages/account";
import ForgotPassword from "./pages/forgot";
import Team from "./pages/team";
import TeamInvite from "./pages/teamInvite";
import Pay from "./pages/pay";
import Reset from "./pages/reset";
import Users from "./pages/admin/users";
import Tests from "./pages/admin/tests";
const App = () => {

  return (
  <React.StrictMode>
    <ErrorBoundary>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/account" element={<Account />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/pay" element={<Pay />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/team" element={<Team />} />
        <Route path="/team-invite" element={<TeamInvite />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/tests" element={<Tests />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
      </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>
  );
};

export default App;
