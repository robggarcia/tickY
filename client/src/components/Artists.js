import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { monthByNumber } from "../api";

import "../styles/Artists.css";

const Artists = ({ artists, artistPage, tickets, cart, setCart }) => {
  const { artistId } = useParams();
  const [artistDetail, setArtistDetail] = useState({});
  const [artistTickets, setArtistTickets] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const grabArtistDetails = async () => {
    for (let artist of artists) {
      if (artist.id === +artistId) {
        setArtistDetail(artist);
        // console.log("artist", artist);
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

  const handleSelect = (e) => {
    setQuantity(+e.target.value);
  };

  const handleAdd = (e, idx) => {
    const ticket = artistTickets[idx];
    const numTickets = artistTickets[idx].count;
    const newCartItem = {
      ticket,
      quantity: numTickets,
    };
    console.log("newCartItem", newCartItem);
    setCart([...cart, newCartItem]);
  };

  const handleChange = (e, idx) => {
    const { value, name } = e.target;
    const newTickets = [...artistTickets];
    newTickets[idx] = {
      ...newTickets[idx],
      [name]: value,
    };
    console.log(newTickets);
    setArtistTickets(newTickets);
  };

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
              <div className="item" key={idx}>
                <div className="ticket-date">
                  <p>{ticket.month}</p>
                  <p>{ticket.day}</p>
                  <p>{ticket.year}</p>
                </div>
                <div className="ticket-info">
                  <p>{ticket.artist.name}</p>
                  <p>
                    {ticket.venue.name}, {ticket.venue.city},{" "}
                    {ticket.venue.state}
                  </p>
                  <p>Price: ${ticket.price} each</p>
                  <p>Tickets available: {ticket.quantity}</p>
                </div>
                <div className="quantity">
                  <input
                    name="count"
                    type="number"
                    min="0"
                    value={artistTickets[idx].count}
                    onChange={(e) => handleChange(e, idx)}
                  />
                  <button onClick={(e) => handleAdd(e, idx)}>
                    Add To Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Artists;
