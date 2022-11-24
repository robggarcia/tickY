import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  createTicketOrder,
  deleteTicketOrder,
  editTicketOrder,
  monthByNumber,
} from "../api";

import "../styles/Ticket.css";

const Ticket = ({
  token,
  currentOrderId,
  ticket,
  index,
  item,
  cart,
  setCart,
}) => {
  const url = useParams();
  console.log("url", url);
  console.log("index", index);
  console.log("TICKET: ", ticket);

  const [numTickets, setNumTickets] = useState(1);
  const [ticketOrderId, setTicketOrderId] = useState(null);
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    if (item) setNumTickets(item.quantity);
    setMonth(monthByNumber(ticket.date.slice(5, 7)));
    setDay(ticket.date.slice(8, 10));
    setYear(ticket.date.slice(0, 4));
  }, []);

  const handleArtistChange = (e) => {
    setNumTickets(e.target.value);
  };

  const handleAdd = async (e) => {
    const newCartItem = {
      ticket,
      quantity: numTickets,
    };
    console.log("newCartItem", newCartItem);
    setCart([...cart, newCartItem]);
    // if the user is logged in, create a new ticket_order
    if (token) {
      console.log("CREATING TICKET ORDER");
      const ticketOrder = await createTicketOrder({
        token,
        orderId: currentOrderId,
        ticketId: ticket.id,
        quantity: numTickets,
      });
      console.log("ticketOrder", ticketOrder);
      setTicketOrderId(ticketOrder.id);
    }
  };

  const handleCartChange = async (e) => {
    setNumTickets(e.target.value);
    // update cart state
    const cartToUpdate = [...cart];
    cartToUpdate[index].quantity = e.target.value;
    console.log("cartToUpdate", cartToUpdate);
    setCart(cartToUpdate);
    // if the user is logged in, update the ticket_order
    if (token) {
      await editTicketOrder({
        token,
        ticketOrderId,
        quantity: numTickets,
      });
    }
  };

  const handleRemove = async (e) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    console.log(newCart);
    setCart(newCart);
    // if user is logged in, delete ticket_order
    if (token) {
      await deleteTicketOrder({ token, ticketOrderId });
    }
  };

  return (
    <div className="item">
      <div className="ticket-date">
        <p>{month}</p>
        <p>{day}</p>
        <p>{year}</p>
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
              onChange={handleArtistChange}
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
                onChange={handleCartChange}
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
