import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { monthByNumber } from "../api";

import "../styles/Artists.css";
import Ticket from "./Ticket";

const Artists = ({
  token,
  currentOrderId,
  artists,
  artistPage,
  tickets,
  cart,
  setCart,
  myOrders,
  setMyOrders,
}) => {
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
                token={token}
                ticket={ticket}
                cart={cart}
                setCart={setCart}
                currentOrderId={currentOrderId}
                myOrders={myOrders}
                setMyOrders={setMyOrders}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Artists;
