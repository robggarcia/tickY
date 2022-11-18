import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Concerts = ({ artists, venues, tickets, setArtistPage }) => {
  const [genres, setGenres] = useState([]);
  const [genreOption, setGenreOption] = useState("any");

  const [cities, setCities] = useState([]);
  const [cityOption, setCityOption] = useState("any");

  const [dateRange, setDateRange] = useState([
    "Today",
    "This Weekend",
    "This Month",
  ]);
  const [dateOption, setDateOption] = useState();

  const [featured, setFeatured] = useState(artists);

  const getGenres = async () => {
    const artistGenres = [];
    for (let artist of artists) {
      if (!artistGenres.includes(artist.genre)) {
        artistGenres.push(artist.genre);
      }
    }
    let sortArr = [...artistGenres];
    sortArr.sort();
    console.log("SORTED GENRES: ", sortArr);
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
    console.log("SORTED CITIES: ", sortArr);
    setCities(sortArr);
  };

  useEffect(() => {
    getGenres();
    getCities();
  }, []);

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
  const filterArtists = () => {
    if (genreOption === "any") {
      setFeatured(artists);
    } else {
      const filteredArtists = featured.filter(
        (artist) => artist.genre === genreOption
      );
      setFeatured(filteredArtists);
    }
    console.log("filteredArtists", featured);
  };

  useEffect(() => {
    filterArtists();
  }, [genreOption]);

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
        {featured &&
          featured.map((artist, idx) => {
            return (
              <div className="artist" key={idx}>
                <Link
                  to={`/artists/${artist.id}`}
                  onClick={() => setArtistPage(artist)}
                >
                  <img src={artist.image} alt={artist.name} />
                  <h4 className="artist-name">{artist.name}</h4>
                </Link>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Concerts;
