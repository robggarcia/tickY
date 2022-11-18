import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Nav.css";

const Nav = ({
  keyword,
  setKeyword,
  setSuggest,
  artists,
  suggest,
  setToken,
  setUser,
}) => {
  const [names, setNames] = useState([]);

  const getArtistsNames = () => {
    const artistNames = [];
    for (let artist of artists) {
      if (!artistNames.includes(artist.name))
        artistNames.push(artist.name.toLowerCase());
    }
    console.log("ARTISTS NAMES: ", artistNames);
    setNames(artistNames);
  };

  useEffect(() => {
    getArtistsNames();
  }, []);

  const handleInput = (e) => {
    setKeyword(e.target.value);
    console.log("KEYWORD: ", keyword);
    searchResults();
  };

  const searchResults = () => {
    const filteredNames = [];
    if (!keyword) {
      setSuggest(filteredNames);
      console.log("filteredNames", filteredNames);
    } else {
      for (let name of names) {
        if (name.includes(keyword)) filteredNames.push(name);
      }
      console.log("FILTERED NAMES: ", filteredNames);
      setSuggest(filteredNames);
    }
  };

  useEffect(() => {
    searchResults();
  }, [keyword]);

  useEffect(() => {
    setToken("");
    setUser("");
  }, []);
  const handleLogOut = () => {
    setToken("");
    setUser("");
    localStorage.clear();
  };

  return (
    <div className="navbar">
      <Link to="/">TickY</Link>
      <input
        id="nav-search"
        type="text"
        placeholder="Search..."
        value={keyword}
        onChange={handleInput}
      />
      <div className="links">
        <Link to="/concerts">Concerts</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/Login">Login</Link>
        <Link to="/" onClick={handleLogOut}>
          Log Out
        </Link>
      </div>
      {suggest.length > 0 && (
        <div className="suggested">
          <h4>Suggested Artists: </h4>
          <div>
            {suggest.map((artist, idx) => {
              return (
                <p key={idx}>
                  <Link>{artist}</Link>
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
