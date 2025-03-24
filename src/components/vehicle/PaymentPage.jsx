import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CreditCardIcon, BanknotesIcon } from "@heroicons/react/24/outline";
import "../../styles/PaymentPage.css"; 

const PaymentPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const bookingId = params.get("bookingId") || localStorage.getItem("bookingId");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method", { position: "top-right" });
      return;
    }

    let paymentMethodId = null;

    if (paymentMethod === "Card" && stripe && elements) {
      setLoading(true);
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      paymentMethodId = paymentMethod.id;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:2000/api/v2/process-payment", {
        bookingId,
        method: paymentMethod,
        paymentMethodId,
      }, { headers: { authorization: `Bearer ${token}` } });

      toast.success("Payment successful!", { position: "top-right" });

      // Redirect to success page
      setTimeout(() => {
        navigate("/payment-success");
      }, 2000);
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Secure Payment</h2>
        <p className="text-gray-600">Select your payment method:</p>

        <div className="flex gap-4 mt-4">
          <button
            onClick={() => setPaymentMethod("COD")}
            className={`flex items-center gap-2 p-3 border rounded-lg w-full ${
              paymentMethod === "COD" ? "bg-green-100 border-green-500" : "bg-gray-100"
            }`}
          >
            <BanknotesIcon className="w-5 h-5 text-gray-700" />
            Cash on Delivery
          </button>

          <button
            onClick={() => setPaymentMethod("Card")}
            className={`flex items-center gap-2 p-3 border rounded-lg w-full ${
              paymentMethod === "Card" ? "bg-blue-100 border-blue-500" : "bg-gray-100"
            }`}
          >
            <CreditCardIcon className="w-5 h-5 text-gray-700" />
            Credit/Debit Card
          </button>
        </div>

        {paymentMethod === "Card" && (
          <div className="mt-4 p-3 border rounded-lg">
            <CardElement />
          </div>
        )}

        <button
          disabled={loading}
          onClick={handlePayment}
          className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
