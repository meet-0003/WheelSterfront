import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51R5syKH83FrM5QBBvEAJjEqkUCNw8MKso5VSRjOd0IFbGxUlk9ZuwMOLnOM7omedlSc4R69TYbtU8g0PS6e78w4j00ugXs0j2s"); // Replace with actual key

const StripeProvider = ({ children }) => {
  return <Elements stripe={stripePromise}>{children}</Elements>
};

export default StripeProvider;
