import React from "react";
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from "./Login.js";
import Mainpage from "./Mainpage.js";

export default function Routingpage() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/main" element={<Mainpage />} />
    </Routes>
  );
}