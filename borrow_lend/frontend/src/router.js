import React from "react";  
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from "./Home.js";
import Login from "./Login.js";
import Mainpage from "./Mainpage.js";
import Chat from "./Chat.js";
import Form from "./requestform.js";
import Profile from "./Profile.js";
import CategoryDetail from "./CategoryDetail.js";
import MyRequests from "./MyRequests.js";

export default function Routingpage() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/main" element={<Mainpage />} />
      <Route path="/category/:id" element={<CategoryDetail />} />
      <Route path="/chat" element={<Chat/>} />
      <Route path="/form" element={<Form/>} />
      <Route path="/profile" element={<Profile/>} />
      <Route path="/my-requests" element={<MyRequests/>} />
    </Routes>
  );
} 