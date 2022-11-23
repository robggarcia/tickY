import { useEffect } from "react";

const Profile = ({ user, myOrders, tickets }) => {
  console.log(tickets);
  const grabTicketById = async () => {
    console.log(myOrders);
    // myOrders.map((order) => {
    //   order.tickets.map(async (ticket) => {
    //     console.log(ticket);
    //     ticket.info = await fetch(`api/tickets/${ticket.id}`, {
    //       method: "GET",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     });
    //   });
    // });
    // console.log(myOrders);
    for (let order of myOrders) {
      if (order.purchased) {
        console.log("grabbing info");
        for (let ticket of order.tickets) {
          const response = await fetch(`api/tickets/${ticket.id}`, {
            method: "GET",
          });
          const info = await response.json();
          console.log(info);
        }
      }
    }
  };

  useEffect(() => {
    grabTicketById();
  });

  if (!user.username) return <></>;
  return (
    <div className="profile">
      <h1>Welcome {user.username}!</h1>
      <div className="order-history">
        <h2>Order History</h2>
        {myOrders[0].tickets.map((ticket) => {
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
