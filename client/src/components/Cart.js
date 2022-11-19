import { useEffect, useState } from "react";
import { fetchTickets, monthByNumber } from "../api";

import "../styles/Cart.css";

const Cart = ({ cart, setCart }) => {
  const [itemsToDisplay, setItemsToDisplay] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  console.log("cart", cart);

  const filterTickets = async () => {
    const tickets = await fetchTickets();
    console.log("AVAILABLE TICKETS: ", tickets);
    const itemsArray = [];
    for (let item of cart) {
      // ticketsArray.push(tickets.find((ticket) => ticket.id === item.ticketId));
      item.ticket = tickets.find((ticket) => ticket.id === item.ticketId);
      itemsArray.push(item);
    }
    let price = 0;
    for (let item of itemsArray) {
      item.ticket.month = monthByNumber(item.ticket.date.slice(5, 7));
      item.ticket.day = item.ticket.date.slice(8, 10);
      item.ticket.year = item.ticket.date.slice(0, 4);
      price += item.ticket.price * item.quantity;
    }
    setItemsToDisplay(itemsArray);
    setTotalPrice(price);
  };

  useEffect(() => {
    filterTickets();
  }, [cart]);

  return (
    <div className="cart">
      <h1 className="banner">Cart</h1>
      {cart.length === 0 && <p>There are no items in your cart</p>}
      {itemsToDisplay.length > 0 && (
        <form>
          {itemsToDisplay.map((item, idx) => {
            return (
              <div className="item" key={idx}>
                <div className="ticket-date">
                  <p>{item.ticket.month}</p>
                  <p>{item.ticket.day}</p>
                  <p>{item.ticket.year}</p>
                </div>
                <div className="ticket-info">
                  <p>{item.ticket.artist.name}</p>
                  <p>
                    {item.ticket.venue.name}, {item.ticket.venue.city},{" "}
                    {item.ticket.venue.state}
                  </p>
                  <p>${item.ticket.price} each</p>
                </div>
                <div className="order-info">
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ${item.quantity * item.ticket.price}</p>
                </div>
                <button>Remove</button>
              </div>
            );
          })}
        </form>
      )}
      <div className="total">
        <h4>Total Cost: ${totalPrice}</h4>
        <button>Purchase Tickets</button>
      </div>
    </div>
  );
};

export default Cart;
