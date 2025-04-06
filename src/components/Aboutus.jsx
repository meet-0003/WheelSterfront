import React from "react";
import Helmet from "../components/Helmet/Helmet";
import AboutSection from "../components/home/AboutSection";
import { Container, Row, Col } from "reactstrap";
import BecomeDriverSection from "../components/home/BecomeDriverSection";

import driveImg from "../assets/all-images/drive.jpeg";
import "../styles/about.css";

const Aboutus = () => {
  return (
    <Helmet title="About">
      <AboutSection aboutClass="aboutPage" />

      <section className="about__page-section">
        <Container>
          <Row>
            <Col lg="6" md="6" sm="12">
              <div className="about__page-img">
                <img src={driveImg} alt="" className="w-100 rounded-3" />
              </div>
            </Col>

            <Col lg="6" md="6" sm="12">
              <div className="about__page-content">
                <h2 className="section__title">
                  We Are Committed To Provide Safe Ride Solutions
                </h2>

                <p className="section__description">
                At our vehicle rental service, we are committed to providing safe and reliable ride solutions for all our customers. Your safety is our top priority, and we ensure that every vehicle in our fleet is well-maintained, regularly serviced, and thoroughly sanitized before every ride. 
                </p>

                <p className="section__description">
                We partner with trusted drivers and rental providers to maintain the highest standards of quality and security. Whether you need a car for a business trip, a family vacation, or a weekend getaway, we guarantee a hassle-free experience. Our transparent pricing and insurance options ensure you have complete confidence while renting with us. 
                </p>

                <div className=" d-flex align-items-center gap-3 mt-4">
                  <span className="fs-4">
                    <i class="ri-phone-line"></i>
                  </span>

                  <div>
                    <h6 className="section__subtitle">Need Any Help?</h6>
                    <h4>+91 93167 64250</h4>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <BecomeDriverSection />
    </Helmet>
  );
};

export default Aboutus;