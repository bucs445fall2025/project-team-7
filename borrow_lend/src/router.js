import React from "react";  
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from "./Login.js";
import Mainpage from "./Mainpage.js";
import Chat from "./Chat.js";
import Form from "./requestform.js"
export default function Routingpage() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/main" element={<Mainpage />} />
      <Route path="/chat" element={<Chat/>} />
      <Route path="/form" element={<Form/>} />
    </Routes>
  );
} 