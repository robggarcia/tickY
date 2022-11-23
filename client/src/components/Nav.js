import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Nav.css";

const Nav = ({
  keyword,
  setKeyword,
  setSuggest,
  artists,
  suggest,
  setToken,
  setUser,
  token,
}) => {
  useEffect(() => {
    setToken("");
    setUser("");
  }, []);

  const handleLogOut = () => {
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
    if (!keyword) {
      setSuggest([]);
    } else {
      for (let artist of artists) {
        if (artist.name.toLowerCase().includes(keyword)) {
          filteredNames.push(artist);
        }
      }
      setSuggest(filteredNames);
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
        {token && (
          <Link className="link" to="/profile">
            Profile
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
        </div>
      )}
    </div>
  );
};

export default Nav;
