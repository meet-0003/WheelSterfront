import React from "react";
import "../../styles/FleetSection.css";
import img1 from "../../assets/all-images/carr.png";
import img2 from "../../assets/all-images/bikee.png";
import img3 from "../../assets/all-images/buss.png";
import img4 from "../../assets/all-images/truckk.png";
import { Link} from 'react-router-dom';


const FleetSection = () => {
  const fleetData = [
    {
      title: "Car",
      description: "Drive your dreams with our premium fleet—comfort, style, and reliability at every mile.",
      image: img1,
    },
    {
      title: "Bike",
      description: "Feel the freedom of the open road—rent a bike built for adventure and exploration.",
      image: img2,
    },
    {
      title: "Bus",
      description: "Travel together in comfort and style—our spacious buses are perfect for group adventures.",
      image: img3,
    },
    {
      title: "Truck",
      description: "Power your projects with our rugged trucks—built for heavy loads and tough terrains.",
      image: img4,
    },
  ];

  return (
    <>
    <section className="fleet-section">
      
      
      <div className="fleet-categories">
        {fleetData.map((item, index) => (
          <div key={index} className="fleet-category">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>

      <div className="fleet-images">
        {fleetData.map((item, index) => (
          <img key={index} src={item.image} alt="" className="fleet-image" />
        ))}
      </div>

      <div className="explore-button-container">
    <button className="explore-button"><Link to="/vehicles">Explore Now</Link></button>
  </div>
    </section>
        </>
  );
};

export default FleetSection;