import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import AddReview from "./AddReview";
import "../../styles/testimonial.css";
import { useSelector } from "react-redux";

const Testimonial = () => {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get("http://localhost:2000/api/v2/service-reviews");
      setReviews(response.data);
    } catch (err) {
      setReviews([]);
    }
  };

  const user = useSelector((state) => state.auth.user);


  useEffect(() => {
    fetchReviews();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 3000,
    swipeToSlide: true,
    autoplaySpeed: 2000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 992,
        settings: { slidesToShow: 2, slidesToScroll: 1 },
      },
      {
        breakpoint: 576,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  return (
    <div className="container">


      {/* Testimonials */}
      <Slider {...settings}>
        {reviews.map((rev, index) => (
          <div key={index} className="testimonial py-4 px-3">
            <div className="mb-4 d-flex align-items-center gap-4">
              <img
                src={`http://localhost:2000${rev.user?.avatar}`}
                alt="avatar"
                className="rounded-circle object-fit-cover"
                style={{ width: "70px", height: "70px" }}
              />
              <div className="user-info">
                <div className="flex items-center gap-2">
                  <h6 className="text-base font-semibold">{rev.user?.username || "Anonymous"}</h6>
                  <span className="bg-[#f9a826] rounded px-2 py-1 text-xs uppercase">{rev.user?.role}</span>
                </div>
                <p className="mb-1 text-muted" style={{ fontSize: "0.9rem" }}>{rev.user?.email}</p>
              </div>
            </div>
            <p className="section__description truncate-text">"{rev.comment}"</p>
          </div>
        ))}
      </Slider>

      {/* Add Review Section */}
      <AddReview onReviewAdded={fetchReviews} />
    </div>
  );
};

export default Testimonial;
