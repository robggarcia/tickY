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
  monthByNumber,
} from "./api";
import "./App.css";
import {
  Artists,
  Cart,
  Checkout,
  CheckoutSuccess,
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
  const [artistTickets, setArtistTickets] = useState(null);
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [myOrders, setMyOrders] = useState(null);
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
    console.log("getTickets: ", data);
    setTickets(data);
    // push non duplicate artist tickets
    let ticketsArray = [];
    const artistArray = [];
    for (let ticket of data) {
      if (!artistArray.includes(ticket.artistId)) {
        artistArray.push(ticket.artistId);
        ticketsArray.push(ticket);
      }
    }
    // don't display tickets that have a past date
    const current = new Date();
    ticketsArray = ticketsArray.filter((ticket) => {
      const tickDate = new Date(ticket.date.slice(0, 10));
      if (tickDate > current) {
        return true;
      }
    });
    setArtistTickets(ticketsArray);
  };

  const getUser = async (token) => {
    console.log("GET USER CALLED");
    // check local storage to see if a token is available
    if (localStorage.getItem("token")) setToken(localStorage.getItem("token"));
    if (!token) {
      console.log("THE USER IS NOT DEFINED");
      return;
    }
    const info = await fetchUser(token);
    // console.log("THE USER INFO: ", info);
    if (info.id) {
      setUser(info);
      const orderData = await fetchUsersOrders(token, info.id);
      console.log("orderData", orderData);
      setMyOrders(orderData);
      // sort the returned data by orderId
      orderData.sort((a, b) => a.id - b.id);
      console.log("SORTED orderData", orderData);
      // if the most recent order is not purchased, update the cart
      if (!orderData[orderData.length - 1].purchased) {
        console.log(
          "MOST RECENT ORDER IS NOT PURCHASED",
          orderData[orderData.length - 1]
        );
        const currentOrder = orderData[orderData.length - 1];
        setCurrentOrderId(currentOrder.id);
        let newCart = [...cart];
        if (currentOrder.tickets.length > 0) {
          // setCart([...cart, ...currentOrder]);
          for (let ticket of currentOrder.tickets) {
            const ticketOrder = currentOrder.ticketOrders.find(
              (ticketOrder) => ticketOrder.ticketId === ticket.id
            );

            const item = {
              quantity: ticketOrder.quantity,
              ticketOrderId: ticketOrder.id,
              ticket,
            };
            console.log("ITEM FOR CART: ", item);
            newCart.push(item);
          }
        }
        console.log("NEW CART SET: ", newCart);
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
        setCart={setCart}
      />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              token={token}
              user={user}
              myOrders={myOrders}
              setCart={setCart}
              currentOrderId={currentOrderId}
              setMyOrders={setMyOrders}
              setCurrentOrderId={setCurrentOrderId}
              artistTickets={artistTickets}
              setArtistTickets={setArtistTickets}
            />
          }
        />
        {myOrders && artistTickets.length > 0 && (
          <Route
            path="/checkout-success"
            element={
              <CheckoutSuccess
                token={token}
                user={user}
                myOrders={myOrders}
                setCart={setCart}
                currentOrderId={currentOrderId}
                setMyOrders={setMyOrders}
                setCurrentOrderId={setCurrentOrderId}
                artistTickets={artistTickets}
                setArtistTickets={setArtistTickets}
                tickets={tickets}
                setTickets={setTickets}
              />
            }
          />
        )}

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
              setMyOrders={setMyOrders}
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
              token={token}
              currentOrderId={currentOrderId}
              artists={artists}
              tickets={tickets}
              cart={cart}
              setCart={setCart}
              myOrders={myOrders}
              setMyOrders={setMyOrders}
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
