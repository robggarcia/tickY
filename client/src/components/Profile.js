import "../styles/Profile.css";

const Profile = ({ user, myOrders }) => {
  console.log(myOrders);

  if (!user.username) return <></>;
  return (
    <div className="profile">
      <h1>Welcome {user.username}!</h1>
      <div className="order-history">
        <h2>Order History</h2>
        {myOrders.length > 0 &&
          myOrders.map((order) => {
            return (
              <div key={order.id} className="order-div">
                {order.purchased &&
                  order.tickets.map((ticket) => {
                    console.log(ticket);
                    return (
                      <div className="usersTicket" key={ticket.id}>
                        <div>
                          <p className="usersTicketDate">{ticket.date}</p>
                        </div>
                        <div className="usersTicketInfo">
                          <p>{ticket.artist.name}</p>
                          <p>
                            {ticket.venue.name}, {ticket.venue.city},{" "}
                            {ticket.venue.state}
                          </p>
                        </div>
                        <div className="usersTicketsBought">
                          <p>Price: {ticket.price}</p>
                          <p>Amount Purchased: {ticket.quantity}</p>
                          <p>Total: ${ticket.price * ticket.quantity} </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Profile;
