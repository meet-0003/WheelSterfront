import React from 'react'
import HeroSlider from "../components/home/HeroSlider";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col } from "reactstrap";
import AboutSection from "../components/home/AboutSection";
import ServicesList from '../components/home/ServicesList';
// import categoryData from '../assets/data/categoryData';
// import VehicleItem from '../components/UI/VehicleItem';
import BecomeDriverSection from '../components/home/BecomeDriverSection';
import Testimonial from '../components/home/Testimonial';
import FleetSection from '../components/home/FleetSection';

const Home = () => {
    return (
      <>
       <Helmet title="Home">
  {/* ============= hero section =========== */}
  <section className="p-0 hero__slider-section">
        <HeroSlider />
      </section>

      {/* =========== about section ================ */}
      <AboutSection />

      {/* ========== services section ============ */}
      <section>
        <Container>
          <Row>
            <Col lg="12" className="mb-5 text-center">
              <h6 className="section__subtitle">See our</h6>
              <h2 className="section__title">Popular Services</h2>
            </Col>

            <ServicesList />
          </Row>
        </Container>
      </section>

      {/* =========== explore section ============= */}
      <section>
        <Container>
          <Row>
            <Col lg="12" className="text-center mb-5">
              <h6 className="section__subtitle">Explore</h6>
              <h2 className="section__title">Our wide range of vehicles</h2>
            </Col>

            <FleetSection/>
          </Row>
        </Container>
      </section>

      {/* =========== become a driver section ============ */}
      <BecomeDriverSection />

      {/* =========== testimonial section =========== */}
      <section>
        <Container>
          <Row>
            <Col lg="12" className="mb-4 text-center">
              <h6 className="section__subtitle">Our clients says</h6>
              <h2 className="section__title">Testimonials</h2>
            </Col>

            <Testimonial />
          </Row>
        </Container>
      </section>
      </Helmet>
      </>
      )
}

export default Home