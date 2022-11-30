import { useState } from "react";
import "../styles/Profile.css";

const Profile = ({ user, myOrders }) => {
  const [editProfile, setEditProfile] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newPassWord, setNewPassWord] = useState("");

  const createEditForm = (event) => {
    event.preventDefault();
    setEditProfile(true);
  };

  if (!user.username) return <></>;
  return (
    <div className="profile">
      <h1>Welcome {user.username}!</h1>
      <form onSubmit={createEditForm}>
        <input type="submit" value="Edit Profile" />
      </form>
      <div className="order-history">
        <h2>Order History</h2>
        {myOrders.length > 0 &&
          myOrders.map((order) => {
            return (
              <div key={order.id} className="order-div">
                {order.purchased &&
                  order.tickets.map((ticket) => {
                    return (
                      <div className="usersTicket" key={ticket.id}>
                        <div>
                          <p className="usersTicketDate">{ticket.month}</p>
                          <p className="usersTicketDate">{ticket.day}</p>
                          <p className="usersTicketDate">{ticket.year}</p>
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
                        {editProfile && (
                          <div className="edit-profile">
                            <form>
                              <div>
                                <input type="text" />
                              </div>
                            </form>
                          </div>
                        )}
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
