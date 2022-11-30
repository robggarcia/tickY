import React from "react";
import { useState, useEffect } from "react";
import { grabAllUsers } from "../api";

import "../styles/Admin.css";

const Admin = ({ user, token, venues, artists, tickets }) => {
  const [isShown, setIsShown] = useState(false);

  const [users, setUsers] = useState(null);
  const [showUsers, setShowUsers] = useState(false);
  const [showTickets, setShowTickets] = useState(false);
  const [showArtists, setShowArtists] = useState(false);
  const [showVenues, setShowVenues] = useState(false);

  const fetchUsersAdmin = async () => {
    const allUsers = await grabAllUsers(token);
    console.log("ALL USERS TO DISPLAY: ", allUsers);
    setUsers(allUsers);
  };

  useEffect(() => {
    fetchUsersAdmin();
  }, []);

  const testButton = (event) => {
    setIsShown(true);
  };

  const fetchUsersAdmin = async (e) => {
    setIsShown(true);
  };

  const fetchTicketsAdmin = async (e) => {};

  const fetchArtistsAdmin = async (e) => {};

  const fetchVenuesAdmin = async (e) => {};

  return (
    <div className="admin">
      <h1>Admin Dashboard</h1>
      <div className="admin-container">
        <div className="admin-sidebar">
          <button onClick={fetchUsersAdmin}>Users</button>
          {isShown && (
            <div>
              <h2>Users button works!</h2>
            </div>
          )}
          <button onClick={() => setShowUsers(!showUsers)}>Users</button>
          <button onClick={() => setShowTickets(!showTickets)}>Tickets</button>
          <button onClick={() => setShowArtists(!showArtists)}>Artists</button>
          <button onClick={() => setShowVenues(!showVenues)}>Venues</button>
          <button onClick={testButton}>Test</button>
          {isShown && (
            <div>
              <h2>Hi</h2>
            </div>
          )}
        </div>
        {showUsers && (
          <div className="admin-users">
            <table>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Admin</th>
                <th>Edit</th>
              </tr>
              {users.map((user, idx) => {
                <tr key={idx} id={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.admin}</td>
                  <td>
                    <button>Edit</button>
                  </td>
                </tr>;
              })}
            </table>
          </div>
        )}
        {showTickets && (
          <div className="admin-tickets">
            <table>
              <tr>
                <th>Artist</th>
                <th>Venue</th>
                <th>Date</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Edit</th>
              </tr>
              {tickets.map((ticket, idx) => {
                <tr key={idx} id={ticket.id}>
                  <th>{ticket.artist.name}</th>
                  <th>{ticket.venue.name}</th>
                  <th>{ticket.date.slice(0, 10)}</th>
                  <th>{ticket.price}</th>
                  <th>{ticket.quantity}</th>
                  <td>
                    <button>Edit</button>
                  </td>
                </tr>;
              })}
            </table>
          </div>
        )}
        {showArtists && (
          <div className="admin-artists">
            <table>
              <tr>
                <th>Name</th>
                <th>Genre</th>
                <th>Image</th>
                <th>Description</th>
                <th>Edit</th>
              </tr>
              {artists.map((artist, idx) => {
                <tr key={idx} id={artist.id}>
                  <th>{artist.name}</th>
                  <th>{artist.genre}</th>
                  <th>{artist.image}</th>
                  <th>{artist.description}</th>
                  <td>
                    <button>Edit</button>
                  </td>
                </tr>;
              })}
            </table>
          </div>
        )}
        {showVenues && (
          <div className="admin-venues">
            <table>
              <tr>
                <th>Name</th>
                <th>City</th>
                <th>State</th>
                <th>Capacity</th>
                <th>Edit</th>
              </tr>
              {venues.map((venue, idx) => {
                <tr key={idx} id={venue.id}>
                  <th>{venue.name}</th>
                  <th>{venue.city}</th>
                  <th>{venue.state}</th>
                  <th>{venue.capacity}</th>
                  <td>
                    <button>Edit</button>
                  </td>
                </tr>;
              })}
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
