import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { monthByNumber } from "../api";

const Concerts = ({
  artists,
  venues,
  tickets,
  artistTickets,
  setArtistTickets,
}) => {
  const [genres, setGenres] = useState([]);
  const [genreOption, setGenreOption] = useState("any");
  const [cities, setCities] = useState([]);
  const [cityOption, setCityOption] = useState("any");
  const [dateRange, setDateRange] = useState([
    "Today",
    "This Week",
    "This Month",
  ]);
  const [dateOption, setDateOption] = useState();
  const [featured, setFeatured] = useState(artistTickets);

  const getGenres = async () => {
    const artistGenres = [];
    for (let artist of artists) {
      if (!artistGenres.includes(artist.genre)) {
        artistGenres.push(artist.genre);
      }
    }
    let sortArr = [...artistGenres];
    sortArr.sort();
    // console.log("SORTED GENRES: ", sortArr);
    setGenres(sortArr);
  };

  const getCities = async () => {
    const venuesCities = [];
    for (let venue of venues) {
      if (!venuesCities.includes(venue.city)) {
        venuesCities.push(venue.city);
      }
    }
    let sortArr = [...venuesCities];
    sortArr.sort();
    // console.log("SORTED CITIES: ", sortArr);
    setCities(sortArr);
  };

  useEffect(() => {
    getGenres();
    getCities();
    // push non duplicate artist tickets
    console.log("UPDATE ARTIST TICKETS");
    let ticketsArray = [];
    const artistArray = [];
    for (let ticket of tickets) {
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
  }, []);

  /*   useEffect(() => {
    // push non duplicate artist tickets
    console.log("UPDATE ARTIST TICKETS");
    let ticketsArray = [];
    const artistArray = [];
    for (let ticket of tickets) {
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
  }, [tickets]); */

  const handleGenreOption = (e) => {
    setGenreOption(e.target.value);
  };

  const handleCityOption = (e) => {
    setCityOption(e.target.value);
  };

  const handleDateOption = (e) => {
    setDateOption(e.target.value);
  };

  // need to filter artists based on user filters
  const filterTickets = () => {
    let filteredArtists = [...artistTickets];
    // filter by genre
    if (genreOption !== "any") {
      filteredArtists = filteredArtists.filter(
        (ticket) => ticket.artist.genre === genreOption
      );
    }
    // filter by city
    if (cityOption !== "any") {
      filteredArtists = filteredArtists.filter(
        (ticket) => ticket.venue.city === cityOption
      );
    }
    // filter by date
    if (dateOption !== "any") {
      const current = new Date();
      // difference between current and ticket.date will be in MS
      if (dateOption === "Today") {
        filteredArtists = filteredArtists.filter((ticket) => {
          const tickDate = new Date(ticket.date.slice(0, 10));
          const diff = tickDate - current;
          const day = 24 * 60 * 60 * 1e3;
          if (diff < day) {
            return true;
          }
        });
      } else if (dateOption === "This Week") {
        filteredArtists = filteredArtists.filter((ticket) => {
          const tickDate = new Date(ticket.date.slice(0, 10));
          const diff = tickDate - current;
          const week = 7 * 24 * 60 * 60 * 1e3;
          if (diff < week) {
            return true;
          }
        });
      } else if (dateOption === "This Month") {
        filteredArtists = filteredArtists.filter((ticket) => {
          const tickDate = new Date(ticket.date.slice(0, 10));
          const diff = tickDate - current;
          const month = 31 * 24 * 60 * 60 * 1e3;
          if (diff < month) {
            return true;
          }
        });
      }
    }
    setFeatured(filteredArtists);
  };

  useEffect(() => {
    filterTickets();
  }, [genreOption, cityOption, dateOption]);

  return (
    <div className="concerts">
      <h1 className="banner">Concerts</h1>
      <div className="filters">
        <div className="filter genre">
          <div className="count-div">
            <label htmlFor="genre">Genre</label>
            <span className="count">{`(${genres.length})`}</span>
          </div>
          <select value={genreOption} onChange={handleGenreOption}>
            <option value="any">Any</option>
            {genres.map((genre, idx) => (
              <option key={idx}>{genre}</option>
            ))}
          </select>
        </div>
        <div className="filter city">
          <div className="count-div">
            <label htmlFor="city">City</label>
            <span className="count">{`(${cities.length})`}</span>
          </div>
          <select value={cityOption} onChange={handleCityOption}>
            <option value="any">Any</option>
            {cities.map((city, idx) => (
              <option key={idx}>{city}</option>
            ))}
          </select>
        </div>
        <div className="filter date">
          <div className="count-div">
            <label htmlFor="date">Date</label>
          </div>
          <select value={dateOption} onChange={handleDateOption}>
            <option value="all dates">All Dates</option>
            {dateRange.map((date, idx) => (
              <option key={idx}>{date}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="artists">
        {featured.length > 0 &&
          featured.map((ticket, idx) => {
            return (
              <div className="artist" key={idx}>
                <Link to={`/artists/${ticket.artist.id}`}>
                  <img src={ticket.artist.image} alt={ticket.artist.name} />
                  <h4 className="artist-name">{ticket.artist.name}</h4>
                </Link>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Concerts;
