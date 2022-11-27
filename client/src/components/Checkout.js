import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

import "../styles/Checkout.css";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CheckoutForm } from ".";

const PUBLIC_KEY =
  "pk_test_51M8NgkLCbsSbGPC1m0fZ2cACVLnbP7Htb8CVBxuvLxeVEI8hgnZC9KZw91I7piXRDUrrwEH92dRNQoVK9ucrKOju00VA8T6GC5";

const stripePromise = loadStripe(PUBLIC_KEY);

const Checkout = ({ token, user, myOrders }) => {
  const { orderId } = useParams();
  const [currentOrder, setCurrentOrder] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  const getCurrentOrder = async () => {
    const order = myOrders.find((order) => order.id === +orderId);
    setCurrentOrder(order);
    let price = 0;
    for (let ticket of order.tickets) {
      price += ticket.price * ticket.quantity;
    }
    setTotalPrice(price);

    // Create PaymentIntent as soon as the page loads
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: currentOrder, totalPrice: price }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  };

  useEffect(() => {
    getCurrentOrder();
  }, [myOrders]);

  const [clientSecret, setClientSecret] = useState("");

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="checkout">
      <div className="checkout-items">
        <h1>Checkout</h1>
        <div className="items-for-checkout">
          <div className="item-container">
            {currentOrder &&
              currentOrder.tickets.map((ticket, idx) => {
                return (
                  <div key={idx} className="ticket-prev">
                    <img src={ticket.artist.image} alt={ticket.artist.name} />
                    <h3>{ticket.artist.name}</h3>
                    <p>Quantity: {currentOrder.ticketOrders[idx].quantity}</p>
                  </div>
                );
              })}
          </div>
        </div>
        <h3 className="total-cost">Total Charge: ${totalPrice}</h3>
      </div>
      <div className="stripe-container">
        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        )}
      </div>
    </div>
  );
};

export default Checkout;
