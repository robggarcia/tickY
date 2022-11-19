import { useEffect, useState } from "react";

const Cart = ({ cart, setCart, tickets }) => {
  const [ticketsToDisplay, setTicketsToDisplay] = useState([]);

  const filterTickets = () => {
    const ticketsArray = [];
    for (let item of cart) {
      ticketsArray.push(tickets.find((ticket) => (ticket.id = item.ticketId)));
    }
    setTicketsToDisplay(ticketsArray);
  };

  useEffect(() => {
    filterTickets();
  }, [cart]);
  //testing git here
  return (
    <div className="cart">
      <h1 className="banner">Cart</h1>
      {cart.length === 0 && <p>There are no items in your cart</p>}
      {cart.length > 0 && (
        <div className="cart-items">
          {cart.map((ticket, idx) => {
            return (
              <form
                className="tickets"
                id={ticket.id}
                key={ticket.id}
                // onSubmit={handleAdd}
              >
                <div className="ticket-date">
                  <p>{ticket.date}</p>
                </div>
                <div className="ticket-info">
                  <p>{ticket.artist.name}</p>
                  <p>
                    {ticket.venue.name}, {ticket.venue.city},{" "}
                    {ticket.venue.state}
                  </p>
                  <p>Price: {ticket.price}</p>
                  <p>Tickets available: {ticket.quantity}</p>
                </div>
                <div className="ticket-quantity">
                  <select value={ticket.quantity}>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    <option>6</option>
                    <option>7</option>
                    <option>8</option>
                    <option>9</option>
                    <option>10</option>
                  </select>
                  <button>Add to Cart</button>
                </div>
              </form>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Cart;
