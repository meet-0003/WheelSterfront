import React from "react";
import Slider from "react-slick";

import "../../styles/testimonial.css";

import ava01 from "../../assets/all-images/ava-1.jpeg";
import ava02 from "../../assets/all-images/ava-2.jpeg";
import ava03 from "../../assets/all-images/ava-3.jpeg";
import ava04 from "../../assets/all-images/ava-4.jpeg";

const Testimonial = () => {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 1000,
    swipeToSlide: true,
    autoplaySpeed: 2000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
    
    <Slider {...settings}>
      <div className="testimonial py-4 px-3">
        <p className="section__description">
        "Absolutely fantastic! I needed a last-minute rental, and this service came through perfectly. The customer support was friendly, and the car performed great throughout my trip. Will surely recommend it to my friends and family!"
        </p>

        <div className="mt-3 d-flex align-items-center gap-4">
          <img src={ava01} alt="" className="w-25 h-25 rounded-2" />

          <div>
            <h6 className="mb-0 mt-3">James Carter</h6>
            <p className="section__description">Customer</p>
          </div>
        </div>
      </div>

      <div className="testimonial py-4 px-3">
        <p className="section__description">
        "I had an amazing experience renting a car from this platform! The booking process was super easy, and the car was in excellent condition. The customer service team was very helpful and responsive. I will definitely use this service again for my future trips!"
        </p>

        <div className="mt-3 d-flex align-items-center gap-4">
          <img src={ava02} alt="" className="w-25 h-25 rounded-2" />

          <div>
            <h6 className="mb-0 mt-3">Sophia Martinez</h6>
            <p className="section__description">Customer</p>
          </div>
        </div>
      </div>

      <div className="testimonial py-4 px-3">
        <p className="section__description">
        I rented a bike for a weekend trip, and everything went smoothly! The prices were affordable, and the pickup was hassle-free. The vehicle was clean and well-maintained. Highly recommend this rental service to anyone looking for reliable transportation!
        </p>

        <div className="mt-3 d-flex align-items-center gap-4">
          <img src={ava03} alt="" className="w-25 h-25 rounded-2" />

          <div>
            <h6 className="mb-0 mt-3">Ryan Patel </h6>
            <p className="section__description">Customer</p>
          </div>
        </div>
      </div>

      <div className="testimonial py-4 px-3">
        <p className="section__description">
        "The best car rental experience I’ve ever had! The website is user-friendly, and I could compare different vehicle options easily. The car was delivered on time, and the return process was seamless. Great service and value for money!"
        </p>

        <div className="mt-3 d-flex align-items-center gap-4">
          <img src={ava04} alt="" className="w-25 h-25 rounded-2" />

          <div>
            <h6 className="mb-0 mt-3">Emma Wilson</h6>
            <p className="section__description">Customer</p>
          </div>
        </div>
      </div>
    </Slider>
    </>
  );
};

export default Testimonial;


