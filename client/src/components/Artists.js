import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { monthByNumber } from "../api";

import "../styles/Artists.css";
import Ticket from "./Ticket";

const Artists = ({ artists, artistPage, tickets, cart, setCart }) => {
  const { artistId } = useParams();
  const [artistDetail, setArtistDetail] = useState({});
  const [artistTickets, setArtistTickets] = useState([]);

  const grabArtistDetails = async () => {
    for (let artist of artists) {
      if (artist.id === +artistId) {
        setArtistDetail(artist);
      }
    }
    const allArtistsTicket = tickets.filter((ticket) => {
      if (ticket.artistId === +artistId) {
        return ticket;
      }
    });
    for (let item of allArtistsTicket) {
      item.month = monthByNumber(item.date.slice(5, 7));
      item.day = item.date.slice(8, 10);
      item.year = item.date.slice(0, 4);
      item.count = 0;
    }
    console.log("allArtistsTicket", allArtistsTicket);
    setArtistTickets(allArtistsTicket);
  };

  useEffect(() => {
    grabArtistDetails();
  }, []);

  console.log(artistDetail);
  console.log(tickets);
  console.log(artistTickets);
  return (
    <div className="artists">
      <div className="artist-div">
        <div className="artist-details">
          <h1>{artistDetail.name}</h1>
          <p>{artistDetail.description}</p>
        </div>
        <img
          className="artistImage"
          src={artistDetail.image}
          alt={artistDetail.name}
        />
      </div>
      <h3>Tickets</h3>
      {artistTickets.length > 0 && (
        <div className="cart-items">
          {artistTickets.map((ticket, idx) => {
            return (
              <Ticket
                key={idx}
                index={idx}
                ticket={ticket}
                cart={cart}
                setCart={setCart}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Artists;
