import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Preloader from "./components/Preloader"; 
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";


import Home from "./pages/Home";
import Logs from "./pages/Logs";
import Notes from "./pages/Notes";
import Kanban from "./pages/Kanban";

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
          <Route path="/" element={<Home />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/kanban" element={<Kanban />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
}

export default App;
