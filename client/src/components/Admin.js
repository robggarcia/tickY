import React from "react";
import { useState, useEffect } from "react";
import {
  adminUpdateVenue,
  createArtist,
  createTicket,
  createVenue,
  destroyArtist,
  destroyTicket,
  destroyUser,
  destroyVenue,
  fetchArtists,
  fetchTickets,
  fetchVenues,
  grabAllUsers,
} from "../api";
import { updateUser, adminUpdateTicket, adminUpdateArtist } from "../api";

import "../styles/Admin.css";

const Admin = ({ user, token }) => {
  const [users, setUsers] = useState(null);
  const [venues, setVenues] = useState(null);
  const [artists, setArtists] = useState(null);
  const [tickets, setTickets] = useState(null);

  const [editUser, setEditUser] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [showTickets, setShowTickets] = useState(false);
  const [showArtists, setShowArtists] = useState(false);
  const [showVenues, setShowVenues] = useState(false);

  const getUsers = async () => {
    const allUsers = await grabAllUsers(token);
    // console.log("ALL USERS TO DISPLAY: ", allUsers);
    setUsers(allUsers);
  };

  const getArtists = async () => {
    const data = await fetchArtists();
    // console.log("getArtists: ", data);
    setArtists(data);
  };
  const getVenues = async () => {
    const data = await fetchVenues();
    // console.log("getVenues: ", data);
    setVenues(data);
  };

  const getTickets = async () => {
    const data = await fetchTickets();
    // console.log("getTickets: ", data);
    setTickets(data);
  };

  useEffect(() => {
    getUsers();
    getArtists();
    getVenues();
    getTickets();
  }, []);

  // EDIT USER
  const canEditUser = async (e) => {
    const user = users.find((user) => user.id === +e.target.id);
    console.log("USER FOUND: ", user);
    setUserId(user.id);
    setUsername(user.username);
    setEmail(user.email);
    setAdmin(user.admin);
    setEditUser(!editUser);
    console.log("USER ID: ", e.target.id);
  };
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [admin, setAdmin] = useState("");
  const submitUser = async () => {
    const user = users.find((user) => user.id === userId);
    const inputFields = { token, userId, username, email, admin };
    if (username === user.username) delete inputFields.username;
    if (email === user.email) delete inputFields.email;
    if (admin === user.admin) delete inputFields.admin;
    console.log("ITEMS TO CHANGE: ", inputFields);
    const updatedUser = await updateUser(inputFields);
    console.log("USER UPDATED: ", updatedUser);
    setEditUser(!editUser);
  };
  const deleteUser = async (e) => {
    const userIdToDelete = users.find((user) => user.id === +e.target.id).id;
    const deletedUser = await destroyUser({
      token,
      userId: userIdToDelete,
    });
    console.log("deletedUser", deletedUser);
  };

  // EDIT TICKETS
  const canEditTicket = async (e) => {
    if (editTicket) {
      setTicketId("");
      setTicketArtistName("");
      setTicketVenueName("");
      setDate("");
      setPrice("");
      setQuantity("");
      setEditTicket(!editTicket);
      return;
    }
    const ticket = tickets.find((ticket) => ticket.id === +e.target.id);
    console.log("TICKET FOUND: ", ticket);
    setTicketId(ticket.id);
    setTicketArtistName(ticket.artist.name);
    setTicketVenueName(ticket.venue.name);
    setDate(ticket.date.slice(0, 10));
    setPrice(ticket.price);
    setQuantity(ticket.quantity);
    setEditTicket(!editTicket);
    console.log("TICKET ID: ", e.target.id);
  };

  const [ticketId, setTicketId] = useState("");
  const [ticketArtistName, setTicketArtistName] = useState("");
  const [ticketVenueName, setTicketVenueName] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [editTicket, setEditTicket] = useState(false);

  const submitTicket = async () => {
    const ticket = tickets.find((ticket) => ticket.id === ticketId);
    const artistId = artists.find(
      (artist) => (artist.name = ticketArtistName)
    ).id;
    const venueId = venues.find((venue) => (venue.name = ticketVenueName)).id;
    const inputFields = {
      token,
      ticketId,
      artistId,
      venueId,
      date,
      price,
      quantity,
    };
    if (editArtist) {
      if (artistId === ticket.artistId) delete inputFields.artistId;
      if (venueId === ticket.venueId) delete inputFields.venueId;
      if (date === ticket.date) delete inputFields.date;
      if (price === ticket.price) delete inputFields.price;
      if (quantity === ticket.quantity) delete inputFields.quantity;
      console.log("ITEMS TO CHANGE: ", inputFields);
      const updatedTicket = await adminUpdateTicket(inputFields);
      console.log("TICKET UPDATED: ", updatedTicket);
    } else {
      delete inputFields.ticketId;
      const newTicket = await createTicket(inputFields);
      console.log("newTicket", newTicket);
      // update Tickets
    }
    setTicketId("");
    setTicketArtistName("");
    setTicketVenueName("");
    setDate("");
    setPrice("");
    setQuantity("");

    if (editTicket) setEditTicket(!editTicket);
  };

  const deleteTicket = async (e) => {
    const ticketIdToDelete = tickets.find(
      (ticket) => ticket.id === +e.target.id
    ).id;
    const deletedTicket = await destroyTicket({
      token,
      ticketId: ticketIdToDelete,
    });
    console.log("deletedTicket", deletedTicket);
    // update Tickets
  };

  // EDIT ARTISTS
  const canEditArtist = async (e) => {
    if (editArtist) {
      setArtistId("");
      setArtistName("");
      setGenre("");
      setImage("");
      setDescription("");
      setEditArtist(!editArtist);
      return;
    }
    const artist = artists.find((artist) => artist.id === +e.target.id);
    console.log("ARTIST FOUND: ", artist);
    setArtistId(artist.id);
    setArtistName(artist.name);
    setGenre(artist.genre);
    setImage(artist.image);
    setDescription(artist.description);
    setEditArtist(!editArtist);
    console.log("TICKET ID: ", e.target.id);
  };
  const [artistId, setArtistId] = useState("");
  const [artistName, setArtistName] = useState("");
  const [genre, setGenre] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [editArtist, setEditArtist] = useState(false);
  const submitArtist = async () => {
    const artist = artists.find((artist) => artist.id === artistId);
    const inputFields = {
      token,
      artistId,
      name: artistName,
      genre,
      image,
      description,
    };
    if (editArtist) {
      if (artistName === artist.name) delete inputFields.name;
      if (genre === artist.genre) delete inputFields.genre;
      if (image === artist.image) delete inputFields.image;
      if (description === artist.description) delete inputFields.description;
      console.log("ITEMS TO CHANGE: ", inputFields);
      const updatedArtist = await adminUpdateArtist(inputFields);
      console.log("ARTIST UPDATED: ", updatedArtist);
    } else {
      delete inputFields.artistId;
      const newArtist = await createArtist(inputFields);
      console.log("newArtist", newArtist);
      // update artists
    }
    setArtistId("");
    setArtistName("");
    setGenre("");
    setImage("");
    setDescription("");

    if (editArtist) setEditArtist(!editArtist);
  };

  const deleteArtist = async (e) => {
    const artistIdToDelete = artists.find(
      (artist) => artist.id === +e.target.id
    ).id;
    const deletedArtist = await destroyArtist({
      token,
      artistId: artistIdToDelete,
    });
    console.log("deletedArtist", deletedArtist);
    // update Artists
  };

  // EDIT VENUES  -- uncomment when ready to test
  const canEditVenues = async (e) => {
    if (editVenue) {
      setVenueId("");
      setVenueName("");
      setCity("");
      setState("");
      setCapacity("");
      setEditVenue(!editVenue);
      return;
    }
    const venue = venues.find((venue) => venue.id === +e.target.id);
    console.log("VENUE FOUND: ", venue);
    setVenueId(venue.id);
    setVenueName(venue.name);
    setCity(venue.city);
    setState(venue.state);
    setCapacity(venue.capacity);
    setEditVenue(!editVenue);
    console.log("VENUE ID: ", e.target.id);
  };

  const [venueId, setVenueId] = useState("");
  const [venueName, setVenueName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [capacity, setCapacity] = useState("");
  const [editVenue, setEditVenue] = useState(false);

  const submitVenue = async () => {
    const venue = venues.find((venue) => venue.id === venueId);
    const inputFields = {
      token,
      venueId,
      name: venueName,
      city,
      state,
      capacity,
    };
    if (editVenue) {
      if (venueName === venue.name) delete inputFields.name;
      if (city === venue.city) delete inputFields.city;
      if (state === venue.state) delete inputFields.state;
      if (capacity === venue.capacity) delete inputFields.capacity;
      console.log("ITEMS TO CHANGE: ", inputFields);
      const updatedVenue = await adminUpdateVenue(inputFields);
      console.log("VENUE UPDATED: ", updatedVenue);
    } else {
      delete inputFields.venueId;
      const newVenue = await createVenue(inputFields);
      console.log("NEW VENUE: ", newVenue);
      // update Venues
    }
    setVenueId("");
    setVenueName("");
    setCity("");
    setState("");
    setCapacity("");

    if (editVenue) setEditVenue(!editVenue);
  };

  const deleteVenue = async (e) => {
    const venueIdToDelete = venues.find(
      (venue) => venue.id === +e.target.id
    ).id;
    const deletedVenue = await destroyVenue({
      token,
      venueId: venueIdToDelete,
    });
    console.log("deletedVenue", deletedVenue);
    // update Venues
  };

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
                  <th>Delete</th>
                </tr>
              </thead>
              {users.map((user, idx) =>
                UserTable({ token, user, idx, canEditUser, deleteUser })
              )}
              {editUser && (
                <>
                  <tr>Edit User</tr>
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
                      <button onClick={submitUser}>Submit</button>
                    </td>
                  </tr>
                </>
              )}
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
                  <th>Delete</th>
                </tr>
              </thead>
              {tickets.map((ticket, idx) =>
                TicketTable({ token, ticket, idx, canEditTicket, deleteTicket })
              )}
              <tbody>
                <tr>
                  <td>{editTicket ? "Edit Ticket" : "Create New Ticket"}</td>
                </tr>
                <tr>
                  <td>
                    <input
                      type="text"
                      value={ticketArtistName}
                      placeholder="Artist Name"
                      onChange={(event) =>
                        setTicketArtistName(event.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={ticketVenueName}
                      placeholder="Venue Name"
                      onChange={(event) =>
                        setTicketVenueName(event.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={date}
                      placeholder="Date"
                      onChange={(event) => setDate(event.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={price}
                      placeholder="Price"
                      onChange={(event) => setPrice(event.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={quantity}
                      placeholder="Quantity"
                      onChange={(event) => setQuantity(event.target.value)}
                    />
                  </td>
                  <td>
                    <button id={ticketId} onClick={submitTicket}>
                      {editTicket ? "SUBMIT" : "CREATE"}
                    </button>
                  </td>
                </tr>
              </tbody>
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
                  <th>Delete</th>
                </tr>
              </thead>
              {artists.map((artist, idx) =>
                ArtistTable({ token, artist, idx, canEditArtist, deleteArtist })
              )}
              <tbody>
                <tr>
                  <td>{editArtist ? "Edit Artist" : "Create New Artist"}</td>
                </tr>
                <tr>
                  <td>
                    <input
                      type="text"
                      value={artistName}
                      placeholder="Artist Name"
                      onChange={(event) => setArtistName(event.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={genre}
                      placeholder="Genre"
                      onChange={(event) => setGenre(event.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={image}
                      placeholder="Image URL"
                      onChange={(event) => setImage(event.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={description}
                      placeholder="Description"
                      onChange={(event) => setDescription(event.target.value)}
                    />
                  </td>
                  <td>
                    <button id={artistId} onClick={submitArtist}>
                      {editArtist ? "Submit" : "Create"}
                    </button>
                  </td>
                </tr>
              </tbody>
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
                  <th>Delete</th>
                </tr>
              </thead>
              {venues.map((venue, idx) =>
                VenuesTable({ token, venue, idx, canEditVenues, deleteVenue })
              )}
              <tbody>
                <tr>
                  <td>{editVenue ? "Edit Venue" : "Create New Venue"}</td>
                </tr>
                <tr>
                  <td>
                    <input
                      type="text"
                      value={venueName}
                      placeholder="Venue Name"
                      onChange={(event) => setVenueName(event.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={city}
                      placeholder="City"
                      onChange={(event) => setCity(event.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={state}
                      placeholder="State"
                      onChange={(event) => setState(event.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={capacity}
                      placeholder="Capacity"
                      onChange={(event) => setCapacity(event.target.value)}
                    />
                  </td>
                  <td>
                    <button id={venueId} onClick={submitVenue}>
                      {editVenue ? "EDIT" : "CREATE"}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// TABLE COMPONENTS TO EDIT INDIVIDUAL ITEMS
const UserTable = ({ token, user, idx, canEditUser, deleteUser }) => {
  return (
    <tbody key={idx}>
      <tr key={idx}>
        <td>{user.username}</td>
        <td>{user.email}</td>
        <td>{user.admin ? "admin" : "user"}</td>
        <td>
          <button id={user.id} onClick={canEditUser}>
            Edit
          </button>
        </td>
        <td>
          <button id={user.id} onClick={deleteUser}>
            Delete
          </button>
        </td>
      </tr>
    </tbody>
  );
};

const TicketTable = ({ token, ticket, idx, canEditTicket, deleteTicket }) => {
  return (
    <tbody key={idx}>
      <tr id={ticket.id}>
        <td>{ticket.artist.name}</td>
        <td>{ticket.venue.name}</td>
        <td>{ticket.date.slice(0, 10)}</td>
        <td>{ticket.price}</td>
        <td>{ticket.quantity}</td>
        <td>
          <button id={ticket.id} onClick={canEditTicket}>
            Edit
          </button>
        </td>
        <td>
          <button id={ticket.id} onClick={deleteTicket}>
            Delete
          </button>
        </td>
      </tr>
    </tbody>
  );
};

const ArtistTable = ({ token, artist, idx, canEditArtist, deleteArtist }) => {
  return (
    <tbody key={idx}>
      <tr id={artist.id}>
        <td>{artist.name}</td>
        <td>{artist.genre}</td>
        <td className="image-url">{artist.image}</td>
        <td className="description">{artist.description}</td>
        <td>
          <button id={artist.id} onClick={canEditArtist}>
            Edit
          </button>
        </td>
        <td>
          <button id={artist.id} onClick={deleteArtist}>
            Delete
          </button>
        </td>
      </tr>
    </tbody>
  );
};

const VenuesTable = ({ token, venue, idx, canEditVenues, deleteVenue }) => {
  return (
    <tbody key={idx}>
      <tr key={idx} id={venue.id}>
        <td>{venue.name}</td>
        <td>{venue.city}</td>
        <td>{venue.state}</td>
        <td>{venue.capacity}</td>
        <td>
          <button id={venue.id} onClick={canEditVenues}>
            Edit
          </button>
        </td>
        <td>
          <button id={venue.id} onClick={deleteVenue}>
            Delete
          </button>
        </td>
      </tr>
    </tbody>
  );
};

export default Admin;
