import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../../styles/PaymentPage.css"; 
import { useLocation } from "react-router-dom";

const PaymentPage = () => {

const location = useLocation();
const params = new URLSearchParams(location.search);
  const bookingId = params.get("bookingId") || localStorage.getItem("bookingId"); // Retrieve from URL or localStorage
  const [paymentMethod, setPaymentMethod] = useState(""); 
  const [cardDetails, setCardDetails] = useState({
    nameOnCard: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const navigate = useNavigate();

  // Handle payment submission
  const handlePayment = async () => {
    if (!paymentMethod) {
        alert("Please select a payment method");
        return;
    }

    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
            "http://localhost:2000/api/v2/process-payment",
            {
                bookingId: bookingId, // Ensure correct field name
                method: paymentMethod,
                paymentId: paymentMethod === "cod" ? "COD" : generatePaymentId(),
            },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        alert(response.data.message);
        navigate("/bookings"); // Redirect to bookings page
    } catch (error) {
        console.error("Payment failed:", error);
        alert(error.response?.data?.message || "Payment failed!");
    }
};

  // Function to generate mock payment ID (for demo purposes)
  const generatePaymentId = () => `PAY_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  return (
    <div className="payment-wrapper">
      <div className="heading-container">
        <h2>Payment Details</h2>
      </div>

      <div className="payment-container">
        <h3>Choose a Payment Method</h3>

        <div className="radio-container">
          <label>
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
            />
            Cash on Delivery
          </label>

          <label>
            <input
              type="radio"
              name="payment"
              value="card"
              checked={paymentMethod === "card"}
              onChange={() => setPaymentMethod("card")}
            />
            Pay with Card
          </label>
        </div>

        {/* Show Card Details Form if "Pay with Card" is Selected */}
        {paymentMethod === "card" && (
          <div className="card-details">
            <label>Name on Card</label>
            <input
              type="text"
              value={cardDetails.nameOnCard}
              onChange={(e) => setCardDetails({ ...cardDetails, nameOnCard: e.target.value })}
              placeholder="Enter name on card"
            />

            <label>Card Number</label>
            <input
              type="number"
              value={cardDetails.cardNumber}
              onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
              placeholder="Enter card number"
            />

            <label>Expiry Date</label>
            <input
              type="month"
              value={cardDetails.expiryDate}
              onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: e.target.value })}
            />

            <label>CVV</label>
            <input
              type="text"
              maxLength="3"
              value={cardDetails.cvv}
              onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
              placeholder="Enter CVV"
            />
          </div>
        )}

        <div className="buttons">
          <Link to={`/book/${bookingId}`} className="back-btn">Back</Link>
          <button className="pay-btn" onClick={handlePayment}>Pay Now</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
