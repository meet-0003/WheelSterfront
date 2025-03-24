import React from "react";
import { Container, Row } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import service1 from "../assets/all-images/s1.jpeg";
import service2 from "../assets/all-images/s2.jpeg";
import service3 from "../assets/all-images/s3.jpeg";
import "../styles/services.css";

const Services = () => {
    return (
        <Helmet title="Vehicles">
      <section>
        <Container>
          <Row>
          <div className="services-container">
        <h1 className="services-title">Our Vehicle Rental Services</h1>
        <p className="services-intro">
          We provide high-quality, reliable, and affordable vehicle rental services to make your journeys comfortable and hassle-free. Whether you need a car for a business trip, a family vacation, or daily commuting, we have a wide range of options tailored to your needs.
        </p>
  
        <div className="service-section bg-black">
          <img src={service1} alt="Luxury Car Rental" className="service-image" />
          <div className="service-content">
            <h2>Luxury Vehicle Rentals</h2>
            <p>
              Experience the thrill of driving a premium vehicle. Our luxury car rental service offers high-end cars equipped with modern features, ensuring a smooth and stylish ride. Choose from brands like Mercedes, BMW, and Audi.
            </p>
            <p><strong>Why Choose Luxury Rentals?</strong></p>
            <ul>
              <li>Top-tier comfort and elegance</li>
              <li>Perfect for business trips and special occasions</li>
              <li>Well-maintained, latest models available</li>
            </ul>
          </div>
        </div>
  
        <div className="service-section bg-[#f9a826]">
        <img src={service2} alt="Long-Term Car Rental" className="service-image" />
          <div className="service-content">
            <h2>Daily & Long-Term Rentals</h2>
            <p>
              Need a vehicle for a short-term or long-term trip? Our daily and long-term rental options provide flexibility at competitive prices. Rent a car for a day, a week, or even months with ease.
            </p>
            <p><strong>Benefits:</strong></p>
            <ul>
              <li>Affordable pricing plans</li>
              <li>Multiple vehicle options (Sedan, SUV, Hatchback)</li>
              <li>Easy extension and cancellation policies</li>
            </ul>
          </div>
        </div>
  
        <div className="service-section bg-black">
          <img src={service3} alt="Bike & Scooter Rental" className="service-image" />
          <div className="service-content">
            <h2>Bike & Scooter Rentals</h2>
            <p>
              For quick and easy transportation, our bike and scooter rental services offer a cost-effective and convenient way to get around. Ideal for city commuting and short-distance travel.
            </p>
            <p><strong>Why Rent a Bike?</strong></p>
            <ul>
              <li>Fuel-efficient and budget-friendly</li>
              <li>Easy navigation through traffic</li>
              <li>Available for hourly and daily rentals</li>
            </ul>
          </div>
        </div>
  
        <div className="services-footer bg-[#f9a826]">
          <h2>Book Your Ride Today!</h2>
          <p>Whether you need a luxury car, a daily rental, or a two-wheeler for quick travel, we've got you covered. Browse our fleet and book your vehicle with ease.</p>
        </div>
      </div>
          </Row>
        </Container>
      </section>
    </Helmet>
      
    );
  };
  
  export default Services;