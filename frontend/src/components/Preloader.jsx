import React from "react";
import "../style.css"; // Make sure it has the scroll/no-scroll styles

function Preloader({ load }) {
  return (
    <div
      id="preloader"
      style={{
        display: load ? "flex" : "none",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#111",
        color: "#fff",
        fontSize: "2rem",
      }}
    >
      Loading DevTrack...
    </div>
  );
}

export default Preloader;
