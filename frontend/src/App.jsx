import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Preloader from "./components/Preloader"; 
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";

import Home from "./pages/Home";
import Logs from "./pages/Logs";
import Notes from "./pages/Notes";
import Kanban from "./pages/Kanban";
import Login from "./pages/Login";  
import PrivateRoute from "./components/PrivateRoute";  
import AuthHandler from "./components/AuthHandler"; 

function App() {
  const [load, setLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoad(false), 1200);
    return () => clearTimeout(timer);
  }, []);


  return (
    <>
      <Preloader load={load} />
      <div className="App" id={load ? "no-scroll" : "scroll"}>
        <Navbar />
        <ScrollToTop />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } />
          <Route path="/logs" element={
            <PrivateRoute>
              <Logs />
            </PrivateRoute>
          } />
          <Route path="/notes" element={
            <PrivateRoute>
              <Notes />
            </PrivateRoute>
          } />
          <Route path="/kanban" element={
            <PrivateRoute>
              <Kanban />
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <AuthHandler />
      </div>
    </>
  );
}

export default App;
