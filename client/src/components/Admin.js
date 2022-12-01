import React from "react";
import { useState, useEffect } from "react";
import { grabAllUsers } from "../api";
import { updateUser, adminUpdateTicket, updateArtist } from "./api";

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

  const fetchTicketsAdmin = async (e) => {};

  const fetchArtistsAdmin = async (e) => {};

  const fetchVenuesAdmin = async (e) => {};

  return (
    <div className="admin">
      <h1>Admin Dashboard</h1>
      <div className="admin-container">
        <div className="admin-sidebar">
          <button onClick={() => setShowUsers(!showUsers)}>Users</button>
          <button onClick={() => setShowTickets(!showTickets)}>Tickets</button>
          <button onClick={() => setShowArtists(!showArtists)}>Artists</button>
          <button onClick={() => setShowVenues(!showVenues)}>Venues</button>
        </div>
        {showUsers && (
          <div className="admin-users">
            <h2>Users</h2>
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Admin</th>
                  <th>Edit</th>
                </tr>
              </thead>
              {users.map((user, idx) => UserTable({ token, user, idx }))}
            </table>
          </div>
        )}
        {showTickets && (
          <div className="admin-tickets">
            <h2>Tickets</h2>
            <table>
              <thead>
                <tr>
                  <th>Artist</th>
                  <th>Venue</th>
                  <th>Date</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Edit</th>
                </tr>
              </thead>
              {tickets.map((ticket, idx) =>
                TicketTable({ token, ticket, idx })
              )}
            </table>
          </div>
        )}
        {showArtists && (
          <div className="admin-artists">
            <h2>Artists</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Genre</th>
                  <th>Image</th>
                  <th>Description</th>
                  <th>Edit</th>
                </tr>
              </thead>
              {artists.map((artist, idx) =>
                ArtistTable({ token, artist, idx })
              )}
            </table>
          </div>
        )}
        {showVenues && (
          <div className="admin-venues">
            <h2>Venues</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Capacity</th>
                  <th>Edit</th>
                </tr>
              </thead>
              {venues.map((venue, idx) => VenuesTable({ token, venue, idx }))}
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

// TABLE COMPONENTS TO EDIT INDIVIDUAL ITEMS
const UserTable = ({ token, user, idx }) => {
  const [edit, setEdit] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [admin, setAdmin] = userState(user.admin);

  const editUser = () => {
    setEdit(!edit);
  };

  const submitUser = async () => {
    const updatedUser = await updateUser({
      token,
      userId: user.id,
      username,
      quantity,
      email,
    });
    console.log("USER UPDATED: ", updatedUser);
    setEdit(!edit);
  };

  return (
    <tbody key={idx}>
      <tr key={idx}>
        <td>{user.username}</td>
        <td>{user.email}</td>
        <td>{user.admin}</td>
        <td>
          <button id={user.id} onClick={editUser}>
            Edit
          </button>
        </td>
      </tr>
      {edit && (
        <tr>
          <td>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </td>
          <td>
            <input
              type="text"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              value={admin}
              onChange={() => setAdmin(!admin)}
            />
          </td>
          <td>
            <button id={user.id} onClick={submitUser}>
              Edit
            </button>
          </td>
        </tr>
      )}
    </tbody>
  );
};

const TicketTable = ({ token, ticket, idx }) => {
  const [edit, setEdit] = useState(false);
  const [artistName, setArtistName] = useState(ticket.artist.name);
  const [venueName, setVenueName] = useState(ticket.venue.name);
  const [date, setDate] = useState(ticket.date.slice(0, 10));
  const [price, setPrice] = userState(ticket.price);
  const [quantity, setQuantity] = userState(ticket.quantity);

  const editTicket = () => {
    setEdit(!edit);
  };

  const submitTicket = async () => {
    const updatedTicket = await adminUpdateTicket({
      token,
      ticketId: ticket.id,
      artistName,
      venueName,
      date,
      price,
      quantity,
    });
    console.log("TICKET UPDATED: ", updatedTicket);
    setEdit(!edit);
  };

  return (
    <tbody key={idx}>
      <tr id={ticket.id}>
        <td>{ticket.artist.name}</td>
        <td>{ticket.venue.name}</td>
        <td>{ticket.date.slice(0, 10)}</td>
        <td>{ticket.price}</td>
        <td>{ticket.quantity}</td>
        <td>
          <button id={ticket.id} onClick={editTicket}>
            Edit
          </button>
        </td>
      </tr>
      {edit && (
        <tr>
          <td>
            <input
              type="text"
              value={artistName}
              onChange={(event) => setArtistName(event.target.value)}
            />
          </td>
          <td>
            <input
              type="text"
              value={venueName}
              onChange={(event) => setVenueName(event.target.value)}
            />
          </td>
          <td>
            <input
              type="text"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </td>
          <td>
            <input
              type="text"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
            />
          </td>
          <td>
            <input
              type="number"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />
          </td>
          <td>
            <button id={ticket.id} onClick={submitTicket}>
              Edit
            </button>
          </td>
        </tr>
      )}
    </tbody>
  );
};

const ArtistTable = ({ artist, idx }) => {
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(artist.name);
  const [genre, setGenre] = useState(artist.genre);
  const [image, setImage] = useState(artist.image);
  const [description, setDescription] = userState(artist.description);

  const editArtist = () => {
    setEdit(!edit);
  };

  const submitArtist = async () => {
    const updatedArtist = await updateArtist({
      token,
      artistId: artist.id,
      name,
      genre,
      image,
      description,
    });
    console.log("ARTIST UPDATED: ", updatedArtist);
    setEdit(!edit);
  };

  return (
    <tbody key={idx}>
      <tr id={artist.id}>
        <td>{artist.name}</td>
        <td>{artist.genre}</td>
        <td className="image-url">{artist.image}</td>
        <td className="description">{artist.description}</td>
        <td>
          <button id={artist.id} onClick={editArtist}>
            Edit
          </button>
        </td>
      </tr>
      {edit && (
        <tr>
          <td>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </td>
          <td>
            <input
              type="text"
              value={genre}
              onChange={(event) => setGenre(event.target.value)}
            />
          </td>
          <td>
            <input
              type="text"
              value={image}
              onChange={(event) => setImage(event.target.value)}
            />
          </td>
          <td>
            <input
              type="text"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </td>
          <td>
            <button id={ticket.id} onClick={submitArtist}>
              Edit
            </button>
          </td>
        </tr>
      )}
    </tbody>
  );
};

const VenuesTable = ({ venue, idx }) => {
  const editVenue = async (e) => {
    console.log("button clicked: ", e.target.id);
  };

  return (
    <tbody>
      <tr key={idx} id={venue.id}>
        <td>{venue.name}</td>
        <td>{venue.city}</td>
        <td>{venue.state}</td>
        <td>{venue.capacity}</td>
        <td>
          <button id={venue.id} onClick={editVenue}>
            Edit
          </button>
        </td>
      </tr>
    </tbody>
  );
};
