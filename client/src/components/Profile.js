import { useState } from "react";
import "../styles/Profile.css";

const Profile = ({ user, myOrders, token }) => {
  const [editProfile, setEditProfile] = useState(false);
  const [usersUserName, setUsersUserName] = useState("");
  const [usersPassword, setUsersPassword] = useState("");
  const [usersEmail, setUsersEmail] = useState("");
  console.log(user);

  const createEditForm = (event) => {
    event.preventDefault();
    setEditProfile(true);
  };

  const handleUpdateUserInfo = async (event) => {
    event.preventDefault();
    const response = await fetch(`api/users/${user.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: usersUserName,
        password: usersPassword,
        email: usersEmail,
      }),
    });

    const data = await response.json();
    console.log(data);
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
                      </div>
                    );
                  })}
              </div>
            );
          })}
        {editProfile && (
          <div className="edit-profile">
            <form onSubmit={handleUpdateUserInfo}>
              <div>
                <p>Current username: {user.username}</p>
                <input
                  type="text"
                  placeholder="New Username"
                  value={usersUserName}
                  onChange={(event) => {
                    setUsersUserName(event.target.value);
                  }}
                />
                <p>Current email: {user.email}</p>
                <input
                  type="text"
                  placeholder="New Email"
                  value={usersEmail}
                  onChange={(event) => {
                    setUsersEmail(event.target.value);
                  }}
                />
                <p>Update Password</p>
                <input
                  type="password"
                  placeholder="New Password"
                  value={usersPassword}
                  onChange={(event) => {
                    setUsersPassword(event.target.value);
                  }}
                />
                <button>Submit Changes</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
