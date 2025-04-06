import React from "react";
import { Container, Row, Col } from "reactstrap";
import "../../styles/about-section.css";
import aboutImg from "../../assets/all-images/aboutbike.png";

const AboutSection = ({ aboutClass }) => {
  return (
    <>
    <section
      className="about__section"
      style={
        aboutClass === "aboutPage"
          ? { marginTop: "0px" }
          : { marginTop: "0px" }
      }
    >
      <Container>
        <Row>
          <Col lg="6" md="6">
            <div className="about__section-content">
              <h1 className="section__subtitle">About Us</h1>
              <h2 className="section__title mt-4">Welcome to our carriage rental service
              </h2>
              <p className="section__description mt-2">
              your go-to destination for reliable and affordable vehicle rentals. 
                We are committed to providing a seamless and hassle-free rental experience, 
                ensuring you get the perfect ride for every journey. Whether you need a car for a business trip, 
                a bike for a quick city commute, or an SUV for a weekend getaway, 
                we have a wide range of well-maintained vehicles to suit your needs.
              </p>

              <div className="about__section-item align-items-center">
                <p className="section__description d-flex align-items-center mt-2 gap-2">
                  <i className="ri-checkbox-circle-line"></i> Trusted vehicle rental service
                </p>

                <p className="section__description d-flex align-items-center mt-2 gap-2">
                  <i className="ri-checkbox-circle-line"></i> Affordable and flexible pricing
                </p>
              </div>

              <div className="about__section-item  align-items-center">
                <p className="section__description d-flex align-items-center mt-2 gap-2">
                  <i className="ri-checkbox-circle-line"></i> Wide range of vehicles
                </p>

                <p className="section__description d-flex align-items-center mt-2 gap-2">
                  <i className="ri-checkbox-circle-line"></i> Easy online booking system
                </p>
              </div>

              <div className="about__section-item align-items-center">
                <p className="section__description d-flex align-items-center mt-2 gap-2">
                  <i className="ri-checkbox-circle-line"></i> Safe and well-maintained cars

                </p>

                <p className="section__description d-flex align-items-center mt-2 gap-2">
                  <i className="ri-checkbox-circle-line"></i>24/7 customer support
                </p>
              </div>
            </div>
          </Col>

          <Col lg="6" md="6">
            <div className="about__img">
              <img src={aboutImg} alt="" className="w-[2000px] h-[400px]" />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
    </>
  );
};

export default AboutSection;