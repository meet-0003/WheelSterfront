import React, { useState } from "react";
import "../../styles/become-driver.css";
import { Container, Row, Col } from "reactstrap";
import driverImg from "../../assets/all-images/beDriversec.png";
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import Login from "../Login"; 


const BecomeDriverSection = () => {
  const user = useSelector((state) => state.auth.user);
  const [isLoginOpen, setIsLoginOpen] = useState(false); 
  const handleClick = () => {
    if (!user) {
      setIsLoginOpen(true); 
    }
  };
  return (
    <>
      <section className="become__driver">
        <Container>
          <Row>
            <Col lg="6" md="6" sm="12" className="become__driver-img">
              <img src={driverImg} alt="" className="w-100" />
            </Col>

            <Col lg="6" md="6" sm="12">
              <h2 className="section__title become__driver-title">
                Do You Want to Earn With Us? So Don't Be Late
              </h2>

              <button
                className="btn become__driver-btn mt-4 hover:bg-gray-200 bg-black text-white"
                onClick={handleClick}
              >
                {user ? (
                  <Link to="/profile" state={{ selectedKey: "3" }}>
                    Become a Driver
                  </Link>
                ) : (
                  "Become a Driver"
                )}
              </button>
            </Col>
          </Row>
        </Container>
      </section>
      <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

    </>
  );
};

export default BecomeDriverSection;