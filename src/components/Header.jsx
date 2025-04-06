import React from "react";
import { useState, useRef } from "react";
import { Container, Row, Col } from "reactstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../styles/header.css";
import Login from "./Login";
import { FaUserCircle } from "react-icons/fa";
import { authActions } from '../store/auth';




const navLinks = [
  { path: "/", display: "Home" },
  { path: "/aboutus", display: "About" },
  { path: "/vehicles", display: "Vehicles" },
  { path: "/services", display: "Services" },
  { path: "/contactus", display: "Contact" }
];

const Header = () => {
  const [isLoginOpen, setLoginOpen] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const openLogin = () => setLoginOpen(true);

  const role = useSelector((state) => state.auth.role);
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const menuRef = useRef(null);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  function toggleMenu(e) {
    e.stopPropagation();
    const menu = document.getElementById('menu');
    if (menuRef.current) {
      menuRef.current.classList.toggle("menu__active");
    }
    if (menu) {
      menu.classList.toggle('open');
    } else {
      console.error("Menu element not found");
    }
  }

  const handleLogout = () => {
    dispatch(authActions.logout());

    dispatch(authActions.changeRole("user"));

    localStorage.removeItem("id");
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate('/');
    window.location.reload();

  };

  return (
    <>
      <header className="header">

        <div className="header__secondary">
          <Container>
            <Row>
              <Col lg="3" md="3" sm="3">
                <div className="logo">
                  <h1>
                    <Link to="/" className="flex">
                      <img src="/img/logoo.png" alt="" className="logo-img" />
                      <span className="logo-name"> WheelSter <br /> <p className="text-sm">Services</p></span>

                    </Link>
                  </h1>
                </div>
              </Col>

              <Col lg="6" md="3" sm="3" className=" d-flex align-items-center justify-content-end ">
                <div className="main__navbar">
                  <Container>
                    <div className="navigation__wrapper d-flex align-items-center justify-content-between gap-2">
                      <span className="mobile__menu">
                        <i className="ri-menu-line" onClick={toggleMenu}></i>
                      </span>

                      <div className="navigation" ref={menuRef} onClick={toggleMenu}>
                        <div className="menu">
                          {navLinks.map((item, index) => (
                            <NavLink
                              to={item.path}
                              className={(navClass) =>
                                navClass.isActive ? "nav__active nav__item" : "nav__item"
                              }
                              key={index}
                            >
                              {item.display}
                            </NavLink>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Container>
                </div>
              </Col>

              <Col lg="3" md="3" sm="3" className=" d-flex align-items-center justify-content-end ">
                <div className="header__secondary__right d-flex align-items-center justify-content-end gap-3">

                  {isLoggedIn && (
                    <div
                      className="profile-container"
                      onMouseEnter={() => setDropdownOpen(true)}
                      onMouseLeave={() => setDropdownOpen(false)}
                    >
                      <div className="profile-icon">
                        <Link to="/profile">
                          {user?.avatar ? (
                            <img src={`http://localhost:2000${user?.avatar}`} alt="Profile" className="profile-image border-blue-500 border-2" />
                          ) : (
                            <FaUserCircle size={35} className="profile-image" />
                          )}
                        </Link>
                      </div>

                      {dropdownOpen && (
                        <div className="dropdown-menu">
                          <ul className="dropdown-content">
                            <li><Link to="/profile" className="btn">Profile</Link></li>
                            <li><Link to="/" className="btn" onClick={handleLogout}>Log Out</Link></li>
                          </ul>
                        </div>
                      )}
                    </div>

                  )}

                  {!isLoggedIn && (
                    <>
                      <div className="flex space-x-4">
                        <button
                          className="flex items-center px-6 py-2 text-white bg-black rounded-lg transition duration-300 shadow-md hover:opacity-80"
                          onClick={openLogin}
                        >
                          <i className="ri-login-circle-line mr-2"></i>Login
                        </button>

                        <Link
                          to="/Signup"
                          className="flex items-center px-6 py-2 text-black bg-[#f9a826] rounded-lg transition duration-300 shadow-md hover:opacity-80"
                        >
                          <i className="ri-user-line mr-2"></i>Sign Up
                        </Link>
                      </div>


                    </>
                  )}
                </div>

              </Col>
            </Row>
          </Container>
        </div>
      </header >
      <Login isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} />

    </>
  )
}

export default Header






