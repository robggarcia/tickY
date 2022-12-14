import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { createOrder, orderSuccess, updateTicket } from "../api";

const CheckoutSuccess = ({
  token,
  user,
  tickets,
  artistTickets,
  setTickets,
  myOrders,
  setMyOrders,
  setCart,
  currentOrderId,
  setCurrentOrderId,
  setArtistTickets,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const result = searchParams.get("redirect_status");

  const updateOrder = async () => {
    if (result !== "succeeded") {
      // set error message here
    } else {
      // set order.purchased to true, update ticket quantities, and empty cart
      // first set purchased to true
      const successOrderUpdate = await orderSuccess(token, currentOrderId);
      console.log("purchased = true: ", successOrderUpdate);
      const myOrdersUpdate = [...myOrders];
      const currentOrder = myOrdersUpdate.find(
        (order) => order.id === currentOrderId
      );
      console.log("CURRENT ORDER: ", currentOrder);
      currentOrder.purchased = true;
      setMyOrders(myOrdersUpdate);
      // update tickets
      const ticketsToEdit = [...artistTickets];
      console.log("tickets in CHECKOUT SUCCESSs", artistTickets);
      for (let purchase of currentOrder.ticketOrders) {
        console.log("purchase.ticketId", purchase.ticketId);
        const ticket = ticketsToEdit.find(
          (ticket) => ticket.id === purchase.ticketId
        );
        console.log("ticket", ticket);
        const updatedTicket = await updateTicket({
          token,
          ticketId: purchase.ticketId,
          quantity: ticket.quantity - purchase.quantity,
        });
        ticket.quantity = ticket.quantity - purchase.quantity;
        console.log("updatedTicket", purchase.quantity, updatedTicket);
      }
      setArtistTickets(ticketsToEdit);
      // empty the cart
      setCart([]);
      // create a new order for the user
      console.log("CREATING A NEW ORDER: ");
      const newOrder = await createOrder(token, user.id);
      console.log("newOrder: ", newOrder);
      setCurrentOrderId(newOrder.id);
    }
  };

  useEffect(() => {
    updateOrder();
  }, []);

  return (
    <div>
      <h1>Checkout Result</h1>
      {result === "succeeded" && (
        <div className="success">
          <h1>Order Successful!</h1>
        </div>
      )}
    </div>
  );
};

export default CheckoutSuccess;
