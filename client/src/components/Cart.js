import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/Cart.css";

const Cart = ({ user, cart, setCart }) => {
  const [itemsToDisplay, setItemsToDisplay] = useState(cart);
  const [totalPrice, setTotalPrice] = useState(0);

  console.log("cart", cart);

  const navigate = useNavigate();

  const updateItems = () => {
    let price = 0;
    for (let item of cart) {
      price += item.ticket.price * item.quantity;
    }
    console.log("price", price);
    setItemsToDisplay(cart);
    setTotalPrice(price);
  };

  useEffect(() => {
    updateItems();
  }, [cart]);

  const handleChange = (e, idx) => {
    const { value, name } = e.target;
    const newCart = [...cart];
    newCart[idx] = {
      ...newCart[idx],
      [name]: value,
    };
    console.log(newCart);
    // update database for individual ticket_order
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
                    min="0"
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
      {cart.length > 0 && (
        <div className="total">
          <h4>Total Cost: ${totalPrice}</h4>
          <button
            onClick={() => {
              // display message to login in order to proceed
              if (!user) {
                navigate("/Login");
              }
            }}
          >
            Secure Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
