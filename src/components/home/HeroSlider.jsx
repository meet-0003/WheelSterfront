import React from "react";

import Slider from "react-slick";
import { Container } from "reactstrap";
import { Link } from "react-router-dom";

import "../../styles/hero-slider.css";

const HeroSlider = () => {
  const settings = {
    fade: true,
    speed: 6000,
    autoplaySpeed: 7000,
    infinite: true,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false,
  };
  return (
    <>
    
    <Slider {...settings} className="hero__slider">
      <div className="slider__item slider__item-01 mt0">
        <Container>
          <div className="slider__content ">
            <h4 className="section__subtitle mb-3">Rent. Ride. Explore.</h4>
            <h1 className="mb-4">Hassle-Free Rentals for Every Journey!</h1>

            <button className="btn reserve__btn mt-4">
              <Link to="/vehicles">Reserve Now</Link>
            </button>
          </div>
        </Container>
      </div>

      <div className="slider__item slider__item-02 mt0">
        <Container>
          <div className="slider__content ">
            <h4 className="section__subtitle mb-3">Rent. Ride. Explore.</h4>
            <h1 className="mb-4">Hassle-Free Rentals for Every Journey!</h1>

            <button className="btn reserve__btn mt-4">
              <Link to="/vehicles">Reserve Now</Link>
            </button>
          </div>
        </Container>
      </div>

      <div className="slider__item slider__item-03 mt0">
        <Container>
          <div className="slider__content ">
            <h4 className="section__subtitle mb-3">Rent. Ride. Explore.</h4>
            <h1 className="mb-4">Hassle-Free Rentals for Every Journey!</h1>

            <button className="btn reserve__btn mt-4">
              <Link to="/vehicles">Reserve Now</Link>
            </button>
          </div>
        </Container>
      </div>

      <div className="slider__item slider__item-04 mt0">
        <Container>
          <div className="slider__content ">
            <h4 className="section__subtitle mb-3">Rent. Ride. Explore.</h4>
            <h1 className="mb-4">Hassle-Free Rentals for Every Journey!</h1>

            <button className="btn reserve__btn mt-4">
              <Link to="/vehicles">Reserve Now</Link>
            </button>
          </div>
        </Container>
      </div>
    </Slider>
    </>
  );
};

export default HeroSlider;