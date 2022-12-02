import { useState } from "react";
import "../styles/Profile.css";

const Profile = ({ user, myOrders, token, setUser }) => {
  const [editProfile, setEditProfile] = useState(false);
  const [editUsername, setEditUsername] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [usersUserName, setUsersUserName] = useState(user.username);
  const [usersPassword, setUsersPassword] = useState("");
  const [usersEmail, setUsersEmail] = useState(user.email);

  console.log(user);

  const createEditForm = (event) => {
    event.preventDefault();
    setEditProfile(!editProfile);
  };

  const createEditUsername = (event) => {
    event.preventDefault();
    setEditUsername(!editUsername);
  };

  const createEditEmail = (event) => {
    event.preventDefault();
    setEditEmail(!editEmail);
  };

  const createEditPassword = (event) => {
    event.preventDefault();
    setEditPassword(!editPassword);
  };

  const handleUpdateUsername = async (event) => {
    event.preventDefault();
    const response = await fetch(`api/users/${user.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: usersUserName,
      }),
    });
    const data = await response.json();
    console.log(data);
    setUser(data);
    setEditUsername(!editUsername);
  };

  const handleUpdateEmail = async (event) => {
    event.preventDefault();
    const response = await fetch(`api/users/${user.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: usersEmail,
      }),
    });
    const data = await response.json();
    console.log(data);
    setUser(data);
    setEditEmail(!editEmail);
  };

  const handleUpdatePassword = async (event) => {
    event.preventDefault();

    const response = await fetch(`api/users/${user.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        password: usersPassword,
      }),
    });
    const data = await response.json();
    console.log("New Updated Password", data);
    setUser(data);
    setEditPassword(!editPassword);
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
          <div>
            <p>Username: {user.username}</p>
            <form onSubmit={createEditUsername}>
              <input type="submit" value="Edit Username" />
            </form>
            {editUsername && (
              <form onSubmit={handleUpdateUsername}>
                <input
                  type="text"
                  placeholder="New Username"
                  value={usersUserName}
                  onChange={(event) => {
                    setUsersUserName(event.target.value);
                  }}
                />
                <input type="submit" />
              </form>
            )}
            <p>Username: {user.email}</p>
            <form onSubmit={createEditEmail}>
              <input type="submit" value="Edit Email" />
            </form>
            {editEmail && (
              <form onSubmit={handleUpdateEmail}>
                <input
                  type="text"
                  placeholder="New Email"
                  value={usersEmail}
                  onChange={(event) => {
                    setUsersEmail(event.target.value);
                  }}
                />
                <input type="submit" />
              </form>
            )}
            <form onSubmit={createEditPassword}>
              <input type="submit" value="Edit Password" />
            </form>
            {editPassword && (
              <form onSubmit={handleUpdatePassword}>
                <input
                  type="text"
                  placeholder="New Password"
                  value={usersPassword}
                  onChange={(event) => {
                    setUsersPassword(event.target.value);
                  }}
                />
                <input type="submit" />
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
