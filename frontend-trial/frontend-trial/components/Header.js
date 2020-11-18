import Link from "next/link";
import "../styles/navbar.css";
import React, { useState, useCallback } from "react";
import Nav from "./nav";

const Header = (props) => {
  return (
    <>
      <Nav />
      {/* <div
        className="Navbar"
        style={{
          textAlign: "center",
          fontSize: "25px",
          fontWeight: "bold",
          display: "flex",
        }}
      >
        <div className="mainHolder">
          <p>El lista trial app</p>
        </div>
      </div> */}
    </>
  );
};

export default Header;
