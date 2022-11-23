// test git eric

import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import {
  createOrder,
  createTicketOrder,
  fetchArtists,
  fetchTickets,
  fetchUser,
  fetchUsersOrders,
  fetchVenues,
} from "./api";
import "./App.css";
import {
  Artists,
  Cart,
  Concerts,
  Home,
  Login,
  Modal,
  Nav,
  Profile,
  Register,
  Venues,
} from "./components";
import Admin from "./components/Admin";

function App() {
  const [artists, setArtists] = useState([]);
  const [venues, setVenues] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [artistTickets, setArtistTickets] = useState([]);
  const [token, setToken] = useState("");
  const [user, setUser] = useState({});
  const [myOrders, setMyOrders] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [suggest, setSuggest] = useState([]);
  const [displayMessage, setDisplayMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [cart, setCart] = useState([]);
  const [currentOrderId, setCurrentOrderId] = useState(null);

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
    // push non duplicate artist tickets
    const ticketsArray = [];
    const artistArray = [];
    for (let ticket of data) {
      if (!artistArray.includes(ticket.artistId)) {
        artistArray.push(ticket.artistId);
        ticketsArray.push(ticket);
      }
    }
    // console.log("ticketsArray", ticketsArray);
    setArtistTickets(ticketsArray);
  };

  const getUser = async (token) => {
    // check local storage to see if a token is available
    if (localStorage.getItem("token")) setToken(localStorage.getItem("token"));
    if (!token) return;
    const info = await fetchUser(token);
    // console.log("THE USER INFO: ", info);
    if (info.id) {
      setUser(info);
      const orderData = await fetchUsersOrders(token, info.id);
      setMyOrders(orderData);
      // if an order is not yet purchased, update the cart
      for (let order of orderData) {
        if (!order.purchased) {
          setCurrentOrderId(order.id);
          setCart([...cart, order]);
        } else {
          // create a new order for the user
          const order = await createOrder(token, info.id);
          console.log(order);
          setCurrentOrderId(order.id);
        }
      }
    }
  };

  useEffect(() => {
    getArtists();
    getVenues();
    getTickets();
    getUser(token);
  }, [token]);

  return (
    <div className="App">
      <Nav
        keyword={keyword}
        artists={artists}
        setKeyword={setKeyword}
        setSuggest={setSuggest}
        suggest={suggest}
        setToken={setToken}
        setUser={setUser}
        token={token}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/concerts"
          element={
            <Concerts
              artists={artists}
              venues={venues}
              tickets={tickets}
              artistTickets={artistTickets}
            />
          }
        />
        <Route
          path="/cart"
          element={
            <Cart user={user} cart={cart} setCart={setCart} tickets={tickets} />
          }
        />
        <Route
          path="/login"
          element={<Login cart={cart} setToken={setToken} token={token} />}
        />
        <Route
          path="/register"
          element={<Register cart={cart} setToken={setToken} token={token} />}
        />
        <Route path="/venues" element={<Venues />} />
        <Route
          path="/artists/:artistId"
          element={
            <Artists
              artists={artists}
              tickets={tickets}
              cart={cart}
              setCart={setCart}
            />
          }
        />
        <Route
          path="/profile"
          element={
            <Profile user={user} myOrders={myOrders} tickets={tickets} />
          }
        />
        <Route
          path="/admin"
          element={
            <Admin
              venues={venues}
              artists={artists}
              tickets={tickets}
              user={user}
            />
          }
        />
      </Routes>
      <Modal displayMessage={displayMessage} success={success} />
    </div>
  );
}

export default App;
