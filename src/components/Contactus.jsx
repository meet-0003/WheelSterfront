import React from "react";
import { Link } from "react-router-dom";
import { Container } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";

const socialLinks = [
  { url: "#", icon: "ri-facebook-line" },
  { url: "#", icon: "ri-instagram-line" },
  { url: "#", icon: "ri-linkedin-line" },
  { url: "#", icon: "ri-twitter-line" },
];

const ContactUs = () => {
  return (
    <Helmet title="Contact">
      <section className="flex justify-center items-center min-h-screen bg-white p-6 relative">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            {/* Left Side - Get In Touch */}
            <div className="bg-black p-6 rounded-2xl shadow-xl h-full border border-black col-span-1 self-center">
              <h2 className="text-3xl font-semibold text-[#f9a826] mb-6 text-center drop-shadow-lg">
                Get In Touch
              </h2>
              <p className="mt-2 items-center text-white mb-4">"Looking for the perfect ride? Let’s connect and make your journey smooth and hassle-free."</p>
              <form className="space-y-5">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full p-3 bg-white text-black rounded-lg border border-black focus:border-[#f9a826] focus:outline-none shadow-lg"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 bg-white text-black rounded-lg border border-black focus:border-[#f9a826] focus:outline-none shadow-lg"
                />
                <textarea
                  rows="5"
                  placeholder="Message"
                  className="w-full p-3 bg-white text-black rounded-lg border border-black focus:border-[#f9a826] focus:outline-none shadow-lg"
                ></textarea>
                <button className="w-full p-3 text-white bg-[#f9a826] rounded-lg shadow-lg transition transform hover:scale-105 hover:bg-black hover:text-[#f9a826]">
                  Send Message
                </button>
              </form>
              <p className="mt-4 text-white">"Need assistance or have questions about our vehicle rental services? We’re here to help! Whether you’re looking to book a ride, need support with your reservation, or just want to learn more about our services, feel free to reach out. Our team is committed to providing you with the best experience, ensuring a smooth and hassle-free journey. Contact us via phone, email, or through the form below, and we’ll get back to you as soon as possible. Let’s connect and make your travel plans easier!"</p>
            </div>

            {/* Right Side - Extra Text & Contact Info & Map */}
            <div className="col-span-2 flex flex-col gap-6">
              {/* Extra Background Text */}
              <div className="text-black text-2xl font-bold tracking-wide bg-[#f9a826] p-6 rounded-xl shadow-md">
                "Need assistance? Have any questions? We are here to help you find the perfect ride! Contact us now."
              </div>

              {/* Contact Information */}
              <div className="bg-black p-6 rounded-2xl shadow-xl border border-black text-white flex flex-col items-center text-center">
                {/* Company Logo */}
                <img
                  src="/img/logoo.png" // Replace with your actual logo path
                  alt="Company Logo"
                  className="w-[100px] h-[60px] mb-4"
                />

                <h3 className="text-xl font-semibold text-[#f9a826] mb-4">Contact Information</h3>
                <p className="text-white">📍 123, Surat, Gujarat, India</p>
                <p className="text-white">📞 +91 93167 64250</p>
                <p className="text-white">📧 WheelSter@gmail.com</p>

                {/* Follow Us Section */}
                <h3 className="text-xl font-semibold text-[#f9a826] mt-6">Follow Us</h3>
                <div className="flex gap-4 mt-3">
                  {socialLinks.map((item, index) => (
                    <a
                      href={item.url}
                      key={index}
                      className="text-white text-2xl hover:text-[#f9a826] transition"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className={`${item.icon}`}></i> {/* Ensuring icon class is properly inserted */}
                    </a>
                  ))}
                </div>
              </div>


              {/* Embedded Map */}
              <div className="overflow-hidden rounded-2xl shadow-xl border border-black">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.007955644987!2d72.79652907503497!3d21.15208168052832!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04dff37ee2f05%3A0x2ed617f17458fa81!2sC%20B%20Patel%20Computer%20College!5e0!3m2!1sen!2sin!4v1740983436840!5m2!1sen!2sin"
                  width="100%"
                  height="350"
                  allowFullScreen=""
                  loading="lazy"
                  className="rounded-lg shadow-lg"
                ></iframe>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </Helmet>
  );
};

export default ContactUs;
