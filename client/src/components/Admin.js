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
import {
  updateUser,
  adminUpdateTicket,
  adminUpdateArtist,
  fetchAllOrders,
} from "../api";

import "../styles/Admin.css";

const Admin = ({
  user,
  token,
  users,
  setUsers,
  venues,
  setVenues,
  artists,
  setArtists,
  tickets,
  setTickets,
  setSuccess,
  setDisplayMessage,
}) => {
  const [usersAdmin, setUsersAdmin] = useState(null);
  const [venuesAdmin, setVenuesAdmin] = useState(null);
  const [artistsAdmin, setArtistsAdmin] = useState(null);
  const [ticketsAdmin, setTicketsAdmin] = useState(null);
  const [ordersAdmin, setOrdersAdmin] = useState(null);

  const [editUser, setEditUser] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [showTickets, setShowTickets] = useState(false);
  const [showArtists, setShowArtists] = useState(false);
  const [showVenues, setShowVenues] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

  const getUsers = async () => {
    const allUsers = await grabAllUsers(token);
    setUsersAdmin(allUsers);
  };

  const getArtists = async () => {
    const data = await fetchArtists();
    setArtistsAdmin(data);
  };
  const getVenues = async () => {
    const data = await fetchVenues();
    setVenuesAdmin(data);
  };

  const getTickets = async () => {
    const data = await fetchTickets();
    setTicketsAdmin(data);
  };

  const getAllOrders = async () => {
    const orders = await fetchAllOrders(token);
    for (let order of orders) {
      order.username = users.find((user) => user.id === order.userId).username;
    }
    // sort orders by unpurchased/puchased and by date
    const purchasedOrders = orders.filter((order) => order.purchased);
    console.log("ALL Purchased ORDERS: ", purchasedOrders);
    const unpurchasedOrders = orders.filter((order) => !order.purchased);
    console.log("ALL UN Purchased ORDERS: ", unpurchasedOrders);
    const sortedOrders = [...unpurchasedOrders, ...purchasedOrders];
    setOrdersAdmin(sortedOrders);
  };

  useEffect(() => {
    console.log("USE EFFECT CALLED");
    getUsers();
    getArtists();
    getVenues();
    getTickets();
    getAllOrders();
  }, [users, venues, tickets, artists]);

  // EDIT USER
  const canEditUser = async (e) => {
    const user = usersAdmin.find((user) => user.id === +e.target.id);
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
    const user = usersAdmin.find((user) => user.id === userId);
    const inputFields = { token, userId, username, email, admin };
    if (username === user.username) delete inputFields.username;
    if (email === user.email) delete inputFields.email;
    if (admin === user.admin) delete inputFields.admin;
    console.log("ITEMS TO CHANGE: ", inputFields);
    const updatedUser = await updateUser(inputFields);
    console.log("USER UPDATED: ", updatedUser);
    setEditUser(!editUser);
    const editUsers = [...usersAdmin];
    for (let user of editUsers) {
      if (user.id === userId) {
        user = updatedUser;
      }
    }
    setUsers(editUsers);
  };
  const deleteUser = async (e) => {
    const userIdToDelete = usersAdmin.find(
      (user) => user.id === +e.target.id
    ).id;
    const deletedUser = await destroyUser({
      token,
      userId: userIdToDelete,
    });
    console.log("deletedUser", deletedUser);
    const editUsers = [...usersAdmin].filter(
      (user) => user.id !== userIdToDelete
    );
    setUsers(editUsers);
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
    const ticket = ticketsAdmin.find((ticket) => ticket.id === +e.target.id);
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
    const ticket = ticketsAdmin.find((ticket) => ticket.id === ticketId);
    const artistId = artistsAdmin.find(
      (artist) => (artist.name = ticketArtistName)
    ).id;
    const venueId = venuesAdmin.find(
      (venue) => (venue.name = ticketVenueName)
    ).id;
    const inputFields = {
      token,
      ticketId: ticket.id,
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
      const editTickets = [...ticketsAdmin];
      for (let ticket of editTickets) {
        if (ticket.id === ticketId) {
          ticket = updatedTicket;
        }
      }
      setTickets(editTickets);
    } else {
      delete inputFields.ticketId;
      const newTicket = await createTicket(inputFields);
      console.log("newTicket", newTicket);
      // update Tickets
      setTickets([...ticketsAdmin].push(newTicket));
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
    const ticketIdToDelete = ticketsAdmin.find(
      (ticket) => ticket.id === +e.target.id
    ).id;
    const deletedTicket = await destroyTicket({
      token,
      ticketId: ticketIdToDelete,
    });
    console.log("deletedTicket", deletedTicket);
    // update Tickets
    const editTickets = [...ticketsAdmin].filter(
      (ticket) => ticket.id !== ticketIdToDelete
    );
    setTickets(editTickets);
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
    const artist = artistsAdmin.find((artist) => artist.id === +e.target.id);
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
    const artist = artistsAdmin.find((artist) => artist.id === artistId);
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
      // set default image if image url not specified
      if (!image)
        inputFields.image =
          "https://media.istockphoto.com/id/1318626501/vector/vector-illustration-concert-ticket-design-template-for-party-or-festival.jpg?s=612x612&w=0&k=20&c=mFdE63pP7j8ZnULrWH0TW5c3o_aE_jDlZW-E_PVvYz8=";
      if (description === artist.description) delete inputFields.description;
      console.log("ITEMS TO CHANGE: ", inputFields);
      const updatedArtist = await adminUpdateArtist(inputFields);
      console.log("ARTIST UPDATED: ", updatedArtist);
      const editArtists = [...artistsAdmin];
      for (let artist of editArtists) {
        if (artist.id === artistId) {
          artist = updatedArtist;
        }
      }
      setArtists(editArtists);
    } else {
      delete inputFields.artistId;
      if (!image)
        inputFields.image =
          "https://media.istockphoto.com/id/1318626501/vector/vector-illustration-concert-ticket-design-template-for-party-or-festival.jpg?s=612x612&w=0&k=20&c=mFdE63pP7j8ZnULrWH0TW5c3o_aE_jDlZW-E_PVvYz8=";
      const newArtist = await createArtist(inputFields);
      console.log("newArtist", newArtist);
      // update artists
      setArtists([...artistsAdmin].push(newArtist));
    }
    setArtistId("");
    setArtistName("");
    setGenre("");
    setImage("");
    setDescription("");

    if (editArtist) setEditArtist(!editArtist);
  };

  const deleteArtist = async (e) => {
    const artistIdToDelete = artistsAdmin.find(
      (artist) => artist.id === +e.target.id
    ).id;
    const deletedArtist = await destroyArtist({
      token,
      artistId: artistIdToDelete,
    });
    console.log("deletedArtist", deletedArtist);
    // update Artists
    const editArtists = [...artistsAdmin].filter(
      (artist) => artist.id !== artistIdToDelete
    );
    setArtists(editArtists);
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
    const venue = venuesAdmin.find((venue) => venue.id === +e.target.id);
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
    const venue = venuesAdmin.find((venue) => venue.id === venueId);
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
      const editVenues = [...venuesAdmin];
      for (let venue of editVenues) {
        if (venue.id === venueId) {
          venue = updatedVenue;
        }
      }
      setVenues(editVenues);
    } else {
      delete inputFields.venueId;
      const newVenue = await createVenue(inputFields);
      console.log("NEW VENUE: ", newVenue);
      // update Venues
      setVenues([...venuesAdmin].push(newVenue));
    }
    setVenueId("");
    setVenueName("");
    setCity("");
    setState("");
    setCapacity("");

    if (editVenue) setEditVenue(!editVenue);
  };

  const deleteVenue = async (e) => {
    const venueIdToDelete = venuesAdmin.find(
      (venue) => venue.id === +e.target.id
    ).id;
    const deletedVenue = await destroyVenue({
      token,
      venueId: venueIdToDelete,
    });
    console.log("deletedVenue", deletedVenue);
    // update Venues
    const editVenues = [...venues].filter(
      (venue) => venue.id !== venueIdToDelete
    );
    setVenues(editVenues);
  };

  return (
    <div className="admincheck">
      {user && !user.admin ? (
        <h1>You do not have access to this page</h1>
      ) : (
        <div className="admin">
          <h1>Admin Dashboard</h1>
          <div className="admin-container">
            <div className="admin-sidebar">
              <button
                onClick={() => {
                  setShowUsers(!showUsers);
                  setShowTickets(false);
                  setShowArtists(false);
                  setShowVenues(false);
                  setShowOrders(false);
                }}
              >
                Users
              </button>
              <button
                onClick={() => {
                  setShowTickets(!showTickets);
                  setShowUsers(false);
                  setShowArtists(false);
                  setShowVenues(false);
                  setShowOrders(false);
                }}
              >
                Tickets
              </button>
              <button
                onClick={() => {
                  setShowArtists(!showArtists);
                  setShowTickets(false);
                  setShowUsers(false);
                  setShowVenues(false);
                  setShowOrders(false);
                }}
              >
                Artists
              </button>
              <button
                onClick={() => {
                  setShowVenues(!showVenues);
                  setShowArtists(false);
                  setShowTickets(false);
                  setShowUsers(false);
                  setShowOrders(false);
                }}
              >
                Venues
              </button>
              <button
                onClick={() => {
                  setShowUsers(false);
                  setShowTickets(false);
                  setShowArtists(false);
                  setShowVenues(false);
                  setShowOrders(!showUsers);
                }}
              >
                Orders
              </button>
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
                  {usersAdmin.map((user, idx) =>
                    UserTable({ token, user, idx, canEditUser, deleteUser })
                  )}
                  {editUser && (
                    <tbody>
                      <tr>Edit User</tr>
                      <tr>
                        <td>
                          <input
                            type="text"
                            value={username}
                            onChange={(event) =>
                              setUsername(event.target.value)
                            }
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
                    </tbody>
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
                  {ticketsAdmin.map((ticket, idx) =>
                    TicketTable({
                      token,
                      ticket,
                      idx,
                      canEditTicket,
                      deleteTicket,
                    })
                  )}
                  <tbody>
                    <tr>
                      <td>
                        {editTicket ? "Edit Ticket" : "Create New Ticket"}
                      </td>
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
                  {artistsAdmin.map((artist, idx) =>
                    ArtistTable({
                      token,
                      artist,
                      idx,
                      canEditArtist,
                      deleteArtist,
                    })
                  )}
                  <tbody>
                    <tr>
                      <td>
                        {editArtist ? "Edit Artist" : "Create New Artist"}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="text"
                          value={artistName}
                          placeholder="Artist Name"
                          onChange={(event) =>
                            setArtistName(event.target.value)
                          }
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
                          onChange={(event) =>
                            setDescription(event.target.value)
                          }
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
                  {venuesAdmin.map((venue, idx) =>
                    VenuesTable({
                      token,
                      venue,
                      idx,
                      canEditVenues,
                      deleteVenue,
                    })
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
            {showOrders && (
              <div className="admin-orders">
                <h2>Orders</h2>
                <table>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Purchased ?</th>
                      <th># of Tickets</th>
                      <th>Cost</th>
                    </tr>
                  </thead>
                  {ordersAdmin.map((order, idx) =>
                    OrdersTable({
                      token,
                      order,
                      idx,
                    })
                  )}
                </table>
              </div>
            )}
          </div>
        </div>
      )}
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
        <td className="image-cell">
          <img alt="artist" src={artist.image}></img>
        </td>
        <td className="description-cell">{artist.description}</td>
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

const OrdersTable = ({ token, order, idx }) => {
  const calculatePrice = (order) => {
    let price = 0;
    for (let item of order.tickets) {
      price += item.price * item.quantity;
    }
    return price;
  };
  return (
    <tbody key={idx}>
      <tr key={idx}>
        <td>{order.username}</td>
        <td>{order.purchased ? "true" : "false"}</td>
        <td>{order.tickets.length}</td>
        <td>${calculatePrice(order)}</td>
      </tr>
    </tbody>
  );
};

export default Admin;
