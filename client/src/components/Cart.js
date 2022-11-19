const Cart = ({ cart, setCart }) => {
  return (
    <div className="cart">
      <h1 className="banner">Cart</h1>
      {cart.length === 0 && <p>There are no items in your cart</p>}
    </div>
  );
};

export default Cart;
