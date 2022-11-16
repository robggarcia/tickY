import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { fetchArtists } from "../api";
import Nav from "./Nav";

const Concerts = ({ artists, venues, tickets }) => {
  const [genres, setGenres] = useState([]);
  const [genreOption, setGenreOption] = useState("any");

  const [cities, setCities] = useState([]);
  const [cityOption, setCityOption] = useState("any");

  const [dateRange, setDateRange] = useState();

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
    setGenres(sortArr);
  };

  useEffect(() => {
    getGenres();
    getCities();
  }, []);

  return (
    <div className="concerts">
      <p>Concerts</p>
    </div>
  );
};

export default Concerts;
