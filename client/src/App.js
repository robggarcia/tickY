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
  Checkout,
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
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [suggest, setSuggest] = useState([]);
  const [displayMessage, setDisplayMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [cart, setCart] = useState([]);

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
      console.log("orderData", orderData);
      setMyOrders(orderData);
      // find the highest orderId
      orderData.sort((a, b) => a.id - b.id);
      console.log("SORTED orderData", orderData);
      // if the most recent order is not purchased, update the cart
      if (!orderData[orderData.length - 1].purchased) {
        console.log(
          "MOST RECENT ORDER IS NOT PURCHASED",
          orderData[orderData.length - 1]
        );
        setCurrentOrderId(orderData[orderData.length - 1].id);
        let newCart = [...cart];
        if (orderData[orderData.length - 1].tickets.length > 0) {
          // setCart([...cart, ...orderData[orderData.length - 1]]);
          for (let item of orderData[orderData.length - 1]) {
            newCart.push(item);
          }
        }
        setCart(newCart);
      } else {
        // create a new order for the user
        console.log("CREATING A NEW ORDER: ");
        const newOrder = await createOrder(token, info.id);
        console.log(newOrder);
        setCurrentOrderId(newOrder.id);
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
            <Cart
              token={token}
              user={user}
              cart={cart}
              setCart={setCart}
              tickets={tickets}
              myOrders={myOrders}
              currentOrderId={currentOrderId}
            />
          }
        />
        <Route
          path="/cart/:orderId/checkout"
          element={<Checkout token={token} user={user} myOrders={myOrders} />}
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
          element={<Profile user={user} myOrders={myOrders} />}
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
