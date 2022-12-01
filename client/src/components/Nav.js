import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Nav.css";

const Nav = ({
  user,
  keyword,
  setKeyword,
  setSuggest,
  setSuggestVenue,
  artists,
  suggest,
  suggestVenue,
  setToken,
  setUser,
  token,
  setCart,
  venues,
  cart,
}) => {
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    console.log("NAV EFFECT CALLED: ", user);
    if (user) {
      setAadmin(user.admin);
    }
  }, [user]);

  const handleLogOut = () => {
    // clear the current cart when logging out
    setCart([]);
    setToken("");
    setUser("");
    localStorage.clear();
  };

  const handleInput = (e) => {
    setKeyword(e.target.value);
    console.log("KEYWORD: ", keyword);
  };

  const searchResults = () => {
    const filteredNames = [];
    const filteredCities = [];
    if (!keyword) {
      setSuggest([]);
    } else {
      for (let artist of artists) {
        if (artist.name.toLowerCase().includes(keyword)) {
          filteredNames.push(artist);
        }
      }
      for (let venue of venues) {
        if (venue.name.toLowerCase().includes(keyword)) {
          filteredCities.push(venue);
        }
      }
      // console.log(filteredCities);
      setSuggest(filteredNames);
      setSuggestVenue(filteredCities);
      console.log(suggestVenue);
    }
  };

  useEffect(() => {
    searchResults();
  }, [keyword]);

  return (
    <div className="navbar">
      <Link className="link" to="/">
        <div className="logo-container">
          <h1 className="logo">tickY</h1>
          <div className="logo-end"></div>
        </div>
      </Link>
      <input
        id="nav-search"
        type="text"
        placeholder="Search..."
        value={keyword}
        onChange={handleInput}
      />
      <div className="links">
        <Link className="link" to="/concerts">
          Concerts
        </Link>
        <Link className="link" to="/cart">
          Cart
        </Link>
        {!token && (
          <Link className="link" to="/Login">
            Login
          </Link>
        )}
        {token && !admin && (
          <Link className="link" to="/profile">
            Profile
          </Link>
        )}
        {token && admin && (
          <Link className="link" to="/admin">
            Admin
          </Link>
        )}
        {token && (
          <Link className="link" to="/" onClick={handleLogOut}>
            Log Out
          </Link>
        )}
      </div>

      {suggest.length > 0 && (
        <div className="suggested">
          <h4>Suggested Artists: </h4>
          <div>
            {suggest.map((artist, idx) => {
              return (
                <p key={idx}>
                  <Link
                    to={`/artists/${artist.id}`}
                    onClick={() => {
                      setKeyword("");
                    }}
                  >
                    {artist.name}
                  </Link>
                </p>
              );
            })}
          </div>
          <h4>Suggested Venues: </h4>
          <div>
            {suggestVenue.map((venue, idx) => {
              return (
                <p key={idx}>
                  <Link
                    to={`/venue/${venue.id}`}
                    onClick={() => {
                      setKeyword("");
                    }}
                  >
                    {venue.name}
                  </Link>
                </p>
              );
            })}
          </div>
        </div>
      )}
      {cart.length > 0 && (
        <div className="cart-bubble-container">
          <p className="cart-bubble">{cart.length}</p>
        </div>
      )}
    </div>
  );
};

export default Nav;
