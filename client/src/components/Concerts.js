import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { monthByNumber } from "../api";

const Concerts = ({ artists, venues, tickets, artistTickets }) => {
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
  /* 
  //get todays date
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  if (mm == 1) {
    mm = "Jan";
  } else if (mm == 2) {
    mm = "Feb";
  } else if (mm == 3) {
    mm = "Mar";
  } else if (mm == 4) {
    mm = "Apr";
  } else if (mm == 5) {
    mm = "May";
  } else if (mm == 6) {
    mm = "Jun";
  } else if (mm == 7) {
    mm = "Jul";
  } else if (mm == 8) {
    mm = "Aug";
  } else if (mm == 9) {
    mm = "Sep";
  } else if (mm == 10) {
    mm = "Oct";
  } else if (mm == 11) {
    mm = "Nov";
  } else if (mm == 12) {
    mm = "Dec";
  }

  var yyyy = today.getFullYear();
  // console.log(typeof yyyy);
  today = mm + " " + dd + ", " + yyyy;
  // console.log(today);

  // check for weekends
  // if undefine then not a weekend , if output is weekend the nweekend
  var is_weekend = function (date1) {
    var dt = new Date(date1);

    if (dt.getDay() == 6 || dt.getDay() == 0) {
      return "weekend";
    }
  };
 */
  // console.log(tickets);

  /* function dateMap(todayDate) {
    for (let item of tickets) {
      item.month = monthByNumber(item.date.slice(5, 7));
      item.day = item.date.slice(8, 10);
      item.year = item.date.slice(0, 4);
      // console.log(item);
    }
  } */

  // dateMap(today);

  // function testingWeekend(numDD) {
  //   // console.log(dd);
  //   for (let i = 0; i < 8; i++) {
  //     if (numMM === 11 && numDD <= 30) {
  //       let newDate = numMM + " " + (numDD + i) + ", " + numYYYY;
  //       console.log(newDate);
  //     } else if (numMM === 11 && numDD > 30) {
  //       let newDate = numMM + 1 + " " + i + ", " + numYYYY;
  //     }
  //   }
  // }

  // testingWeekend(numDD);

  // console.log(is_weekend(today));
  // console.log(isWeekend(today));

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
        console.log("filtering for today");
        filteredArtists = filteredArtists.filter((ticket) => {
          const tickDate = new Date(ticket.date.slice(0, 10));
          const diff = tickDate - current;
          const day = 24 * 60 * 60 * 1e3;
          return diff > day;
        });
      } else if (dateOption === "This Week") {
        console.log("filtering this week");
        filteredArtists = filteredArtists.filter((ticket) => {
          const tickDate = new Date(ticket.date.slice(0, 10));
          const diff = tickDate - current;
          const week = 7 * 24 * 60 * 60 * 1e3;
          return diff > week;
        });
      } else if (dateOption === "This Month") {
        console.log("filtering this month");
        filteredArtists = filteredArtists.filter((ticket) => {
          const tickDate = new Date(ticket.date.slice(0, 10));
          const diff = tickDate - current;
          const month = 31 * 24 * 60 * 60 * 1e3;
          return diff > month;
        });
      }
    }
    // console.log("filteredArtists", filteredArtists);
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
