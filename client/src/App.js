import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { fetchArtists, fetchTickets, fetchUser, fetchVenues } from "./api";
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

// rob test for pushing and pulling

//Push/pull Test - Brandon
function App() {
  const [artists, setArtists] = useState([]);
  const [venues, setVenues] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [token, setToken] = useState("");
  const [user, setUser] = useState({});
  const [myOrders, setMyOrders] = useState({});
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
  };

  const getUser = async (token) => {
    // check local storage to see if a token is available
    if (localStorage.getItem("token")) setToken(localStorage.getItem("token"));
    if (!token) return;
    const info = await fetchUser(token);
    // console.log("THE USER INFO: ", info);
    if (info.id) {
      setUser(info);
    }
  };

  useEffect(() => {
    getArtists();
    getVenues();
    getTickets();
    getUser(token);
  }, [token]);

  useEffect(() => {
    setToken();
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
            <Concerts artists={artists} venues={venues} tickets={tickets} />
          }
        />
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register setToken={setToken} />} />
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
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Modal displayMessage={displayMessage} success={success} />
    </div>
  );
}

export default App;
