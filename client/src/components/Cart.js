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

  const handleChange = (e, idx) => {
    const { value, name } = e.target;
    const newCart = [...cart];
    newCart[idx] = {
      ...newCart[idx],
      [name]: value,
    };
    console.log(newCart);
    setCart(newCart);
  };

  const handleRemove = (e, idx) => {
    const newCart = [...cart];
    newCart.splice(idx, 1);
    console.log(newCart);
    setCart(newCart);
  };

  return (
    <div className="cart">
      <h1 className="banner">Cart</h1>
      {cart.length === 0 && <p>There are no items in your cart</p>}
      {itemsToDisplay.length > 0 && (
        <div className="cart-items">
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
                <div className="quantity">
                  <p>Quantity: </p>
                  <input
                    name="quantity"
                    type="number"
                    value={itemsToDisplay[idx].quantity}
                    onChange={(e) => handleChange(e, idx)}
                  />
                </div>
                <div className="subtotal">
                  <p>Subtotal: ${item.quantity * item.ticket.price}</p>
                </div>
                <button onClick={(e) => handleRemove(e, idx)}>Remove</button>
              </div>
            );
          })}
        </div>
      )}
      <div className="total">
        <h4>Total Cost: ${totalPrice}</h4>
        <button>Purchase Tickets</button>
      </div>
    </div>
  );
};

export default Cart;
