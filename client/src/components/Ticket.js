import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

import "../styles/Ticket.css";

const Ticket = ({ ticket, index, item, cart, setCart }) => {
  const url = useParams();
  console.log("url", url);
  console.log("index", index);

  const [numTickets, setNumTickets] = useState(1);

  useEffect(() => {
    if (item) setNumTickets(item.quantity);
  }, []);

  const handleChange = (e) => {
    setNumTickets(e.target.value);
    // update cart state
    const cartToUpdate = [...cart];
    cartToUpdate[index].quantity = e.target.value;
    console.log("cartToUpdate", cartToUpdate);
    setCart(cartToUpdate);
  };

  const handleAdd = (e) => {
    const newCartItem = {
      ticket,
      quantity: numTickets,
    };
    console.log("newCartItem", newCartItem);
    setCart([...cart, newCartItem]);
  };

  const handleRemove = (e) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    console.log(newCart);
    setCart(newCart);
  };

  return (
    <div className="item">
      <div className="ticket-date">
        <p>{ticket.month}</p>
        <p>{ticket.day}</p>
        <p>{ticket.year}</p>
      </div>
      <div className="ticket-info">
        <p>{ticket.artist.name}</p>
        <p>
          {ticket.venue.name}, {ticket.venue.city}, {ticket.venue.state}
        </p>
        <p>Price: ${ticket.price} each</p>
      </div>
      {url.artistId && (
        <>
          <div className="available">
            <p>Tickets available: {ticket.quantity}</p>
          </div>
          <div className="quantity">
            <input
              name="numTickets"
              type="number"
              min="0"
              value={numTickets}
              onChange={handleChange}
            />
          </div>
          <button onClick={handleAdd}>Add To Cart</button>
        </>
      )}
      {!url.artistId && (
        <>
          <div className="quantity">
            <div className="quant-container">
              <p>Quantity: </p>
              <input
                name="quantity"
                type="number"
                min="0"
                value={numTickets}
                onChange={handleChange}
              />
            </div>
            <p className="subtotal">
              Subtotal: ${item.quantity * item.ticket.price}
            </p>
          </div>
          <button onClick={handleRemove}>Remove</button>
        </>
      )}
    </div>
  );
};

export default Ticket;
