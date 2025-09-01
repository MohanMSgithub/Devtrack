import React, { useState, useEffect, useContext } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineFundProjectionScreen,
  AiOutlineFileText,
  AiOutlineAppstore,
} from "react-icons/ai";
 

import { CgGitFork } from "react-icons/cg";
import { AiFillStar } from "react-icons/ai";

import { AuthContext } from "../context/AuthContext";
import "../App.css";

function NavBar() {
  const [expand, setExpand] = useState(false);
  const [navColour, setNavColour] = useState(false);

  const { user, logout } = useContext(AuthContext); // ✅ from context
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setNavColour(window.scrollY >= 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();                           // clear token + user
    navigate("/");                      // redirect to Home
  };

  return (
    <Navbar
      expanded={expand}
      fixed="top"
      expand="md"
      className={`${navColour ? "sticky" : "navbar"} navbar-dark bg-dark`}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={() => setExpand(false)}>
          <strong>DevTrack</strong>
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          onClick={() => setExpand(expand ? false : "expanded")}
        >
          <span></span>
          <span></span>
          <span></span>
        </Navbar.Toggle>


        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Item>
              <Nav.Link as={Link} to="/" onClick={() => setExpand(false)}>
                <AiOutlineHome style={{ marginBottom: "2px" }} /> Home
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link as={Link} to="/logs" onClick={() => setExpand(false)}>
                <AiOutlineFileText style={{ marginBottom: "2px" }} /> Daily Logs
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link as={Link} to="/notes" onClick={() => setExpand(false)}>
                <AiOutlineFundProjectionScreen style={{ marginBottom: "2px" }} /> Notes
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link as={Link} to="/kanban" onClick={() => setExpand(false)}>
                <AiOutlineAppstore style={{ marginBottom: "2px" }} /> Kanban
              </Nav.Link>
            </Nav.Item>

            <Nav.Item className="fork-btn">
              <Button
                href="https://github.com/mohanmsgithub/devtrack"
                target="_blank"
                className="fork-btn-inner"
              >
                <CgGitFork style={{ fontSize: "1.2em" }} />{" "}
                <AiFillStar style={{ fontSize: "1.1em" }} />
              </Button>
            </Nav.Item>

             {user ? (
                <Nav.Item>
                  <Button
                    variant="outline-danger"
                    className="ms-3"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </Nav.Item>
              ) : (
                <Nav.Item>
                  <Button
                    as={Link}
                    to="/login"
                    variant="outline-success"
                    className="ms-3"
                    onClick={() => setExpand(false)}
                  >
                    Login
                  </Button>
                </Nav.Item>
              )}

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
