import React from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <CheckCircleIcon className="w-24 h-24 text-green-500 mx-auto" />
        <h2 className="text-2xl font-bold text-green-600 mt-4">Payment Successful</h2>
        <p className="text-gray-600 mt-2">Thank you for your payment!</p>
        <Link to="/profile" state={{ selectedKey: "2" }}
          className="mt-4 inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition">
          View Bookings
        </Link>

      </div>
    </div>
  );
};

export default PaymentSuccess;
