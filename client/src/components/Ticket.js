import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { createTicketOrder, deleteTicketOrder, editTicketOrder } from "../api";

import "../styles/Ticket.css";

const Ticket = ({
  token,
  currentOrderId,
  ticket,
  index,
  item,
  cart,
  setCart,
  myOrders,
  user,
  setMyOrders,
}) => {
  const url = useParams();

  const [numTickets, setNumTickets] = useState(1);
  const [ticketOrderId, setTicketOrderId] = useState(null);

  useEffect(() => {
    if (item) setNumTickets(item.quantity);
  }, []);

  const handleArtistChange = (e) => {
    setNumTickets(e.target.value);
  };

  const handleAdd = async (e) => {
    const newCartItem = {
      ticket,
      quantity: numTickets,
    };

    // if the user is logged in, create a new ticket_order
    if (token) {
      console.log("CREATING TICKET ORDER");
      const ticketOrder = await createTicketOrder({
        token,
        orderId: currentOrderId,
        ticketId: ticket.id,
        quantity: numTickets,
      });
      newCartItem.ticketOrder = ticketOrder;
      console.log("ticketOrder", ticketOrder);
      setTicketOrderId(ticketOrder.id);
      // add ticket_order to current order
      const myOrdersUpdate = [...myOrders];
      const currentOrder = myOrdersUpdate.find(
        (order) => order.id === currentOrderId
      );
      currentOrder.ticketOrders.push(ticketOrder);
      currentOrder.tickets.push(ticket);
      setMyOrders(myOrdersUpdate);
    }
    console.log("newCartItem", newCartItem);
    setCart([...cart, newCartItem]);
  };

  const handleCartChange = async (e) => {
    setNumTickets(e.target.value);
    // update cart state
    const cartToUpdate = [...cart];
    cartToUpdate[index].quantity = e.target.value;
    setCart(cartToUpdate);
    // if the user is logged in, update the ticket_order
    if (token) {
      const updatedTicketOrder = await editTicketOrder({
        token,
        ticketOrderId: item.ticketOrderId,
        quantity: numTickets,
      });
      // update ticket_order
      const myOrdersUpdate = [...myOrders];
      const currentOrder = myOrdersUpdate.find(
        (order) => order.id === currentOrderId
      );
      const ticOrderUpdate = currentOrder.ticketOrders.find(
        (tOrder) => tOrder.id === item.ticketOrderId
      );
      ticOrderUpdate.quantity = +e.target.value;
      setMyOrders(myOrdersUpdate);
    }
  };

  const handleRemove = async (e) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    console.log(newCart);
    setCart(newCart);
    // if user is logged in, delete ticket_order
    if (token) {
      await deleteTicketOrder({ token, ticketOrderId: item.ticketOrderId });
      // update current order
      const myOrdersUpdate = [...myOrders];
      const currentOrder = myOrdersUpdate.find(
        (order) => order.id === currentOrderId
      );
      currentOrder.ticketOrders = currentOrder.ticketOrders.filter(
        (tOrder) => tOrder.id !== item.ticketOrderId
      );
      currentOrder.tickets = currentOrder.tickets.filter(
        (tic) => tic.id !== ticket.id
      );
      console.log("currentOrder", currentOrder);
      setMyOrders(myOrdersUpdate);
    }
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
