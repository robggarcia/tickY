import { useEffect, useState } from "react";

const Profile = ({ user, myOrders, tickets }) => {
  const [usersTickets, setUsersTickets] = useState([]);

  const grabTicketById = async () => {
    const savedTickets = [];
    for (let order of myOrders) {
      if (order.purchased) {
        for (let ticket of order.tickets) {
          savedTickets.push(
            tickets.find((tick) => {
              return tick.id === ticket.id;
            })
          );
        }
        setUsersTickets(savedTickets);
        console.log(savedTickets);
        console.log("myOrders", myOrders);
      }
    }
  };

  useEffect(() => {
    grabTicketById();
  }, []);

  if (!user.username) return <></>;
  return (
    <div className="profile">
      <h1>Welcome {user.username}!</h1>
      <div className="order-history">
        <h2>Order History</h2>
        {myOrders.length > 0 &&
          myOrders[0].tickets.map((ticket) => {
            return (
              <div key={ticket.id}>
                <p>Date Purchased: {ticket.date}</p>
                <p>Quanity: {ticket.quantity}</p>
                <p>Price : {ticket.price}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Profile;
