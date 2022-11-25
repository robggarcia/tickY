import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

import "../styles/Checkout.css";

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
  };

  useEffect(() => {
    getCurrentOrder();
  }, [myOrders]);

  return (
    <div className="checkout">
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
  );
};

export default Checkout;
