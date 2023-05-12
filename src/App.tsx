import React, { useState, useEffect, useContext } from "react";
import { UserDataContext } from "./Utils/context";
import logo from "./logo.svg";
import { GoogleLogin } from "@react-oauth/google";
import { getUserProfile } from "./Utils/google";
import Profile from "./Pages/Profile/Profile";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Login from "./Pages/Login/Login";
import { createTable } from "./Utils/airtable";
import "./App.css";
import { isObjectEmpty } from "./Utils/common";

function App() {
  const { profile } = useContext(UserDataContext);

  return (
    <div className="App">
      <div className="App-header">
        {!isObjectEmpty(profile) ? <Profile /> : <Login />}
      </div>
    </div>
  );
}

export default App;
