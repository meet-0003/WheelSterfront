import React from "react";
import { Link } from "react-router-dom";
import "../styles/footer.css";

const quickLinks = [
  { path: "/aboutus", display: "About" },
  { path: "#", display: "Privacy Policy" },
  { path: "/vehicles", display: "Vehicle Listing" },
  { path: "/services", display: "Services" },
  { path: "/contactus", display: "Contact" },
];

const socialLinks = [
  { icon: "ri-facebook-fill", link: "https://facebook.com" },
  { icon: "ri-instagram-fill", link: "https://instagram.com" },
  { icon: "ri-twitter-fill", link: "https://twitter.com" },
  { icon: "ri-linkedin-fill", link: "https://linkedin.com" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-5">
        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-8">
          {/* Company Logo & Description */}
          <div>
            <div className="flex items-center space-x-3">
              <img src="/img/logoo.png" alt="WheelSter Logo" className="w-[100px] h-[60px]" />
              <h1 className="text-xl text-white font-bold">WheelSter Services</h1>
            </div>
            <p className="mt-3 text-gray-400 text-sm">
              Reliable and affordable vehicle rental service. Choose from well-maintained
              cars, bikes, and more for your journey.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-lg font-semibold text-[#f9a826] mb-3">Quick Links</h5>
            <ul className="space-y-2">
              {quickLinks.map((item, index) => (
                <li key={index}>
                  <Link to={item.path} className="text-gray-400 hover:text-white transition">
                    {item.display}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Head Office */}
          <div>
            <h5 className="text-lg font-semibold text-[#f9a826] mb-3">Head Office</h5>
            <p className="text-gray-400">123, Surat, Gujarat</p>
            <p className="text-gray-400">Phone: +91 93167 64250</p>
            <p className="text-gray-400">Email: wheelster123@gmail.com</p>
            <p className="text-gray-400">Office Time: 10am - 7pm</p>
          </div>

          {/* Social Media */}
          <div>
            <h5 className="text-lg font-semibold text-[#f9a826] mb-3">Follow Us</h5>
            <div className="flex space-x-4">
              {socialLinks.map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 text-2xl hover:text-white transition"
                >
                  <i className={item.icon}></i>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400 text-sm">
          <p>&copy; {year} WheelSter Services. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
