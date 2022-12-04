import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/Cart.css";
import Ticket from "./Ticket";

const Cart = ({
  token,
  user,
  cart,
  setCart,
  myOrders,
  setMyOrders,
  currentOrderId,
  setSuccess,
  setDisplayMessage,
}) => {
  const [itemsToDisplay, setItemsToDisplay] = useState(cart);
  const [totalPrice, setTotalPrice] = useState(0);

  console.log("cart", cart);
  console.log("itemsToDisplay", itemsToDisplay);

  const navigate = useNavigate();

  const updateItems = () => {
    console.log("UPDATE ITEMS USE EFFECT CALLED");
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

  return (
    <div className="cart">
      <h1 className="banner">Cart</h1>
      {cart.length === 0 && <p>There are no items in your cart</p>}
      {itemsToDisplay.length > 0 && (
        <div className="cart-items">
          {itemsToDisplay.map((item, idx) => {
            return (
              <Ticket
                key={idx}
                index={idx}
                token={token}
                user={user}
                setMyOrders={setMyOrders}
                item={item}
                ticket={item.ticket}
                cart={cart}
                setCart={setCart}
                currentOrderId={currentOrderId}
                myOrders={myOrders}
                setSuccess={setSuccess}
                setDisplayMessage={setDisplayMessage}
              />
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
              } else {
                navigate(`/cart/${currentOrderId}/checkout`);
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
