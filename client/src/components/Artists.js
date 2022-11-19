import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

const Artists = ({ artists, artistPage, tickets, cart, setCart }) => {
  const { artistId } = useParams();
  const [artistDetail, setArtistDetail] = useState({});
  const [artistTickets, setArtistTickets] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const grabArtistDetails = async () => {
    for (let artist of artists) {
      if (artist.id === +artistId) {
        setArtistDetail(artist);
        console.log("artist", artist);
      }
    }
    const allArtistsTicket = tickets.filter((ticket) => {
      if (ticket.artistId === +artistId) {
        return ticket;
      }
    });
    setArtistTickets(allArtistsTicket);
  };

  useEffect(() => {
    grabArtistDetails();
  }, []);

  const handleSelect = (e) => {
    setQuantity(+e.target.value);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const ticketId = +e.target.id;
    const numTickets = +e.target[0].value;
    const newCartItem = {
      ticketId,
      quantity: numTickets,
    };
    console.log("newCartItem", newCartItem);
    setCart([...cart, newCartItem]);
  };

  console.log(artistDetail);
  console.log(tickets);
  console.log(artistTickets);
  return (
    <div className="artist-detail">
      <h1>{artistDetail.name}</h1>
      <img
        className="artistImage"
        src={artistDetail.image}
        alt={artistDetail.name}
      />
      <p>{artistDetail.description}</p>
      <h3>Tickets</h3>
      {artistTickets &&
        artistTickets.map((ticket) => {
          return (
            <form
              className="tickets"
              id={ticket.id}
              key={ticket.id}
              onSubmit={handleAdd}
            >
              <div className="ticket-date">
                <p>{ticket.date}</p>
              </div>
              <div className="ticket-info">
                <p>{artistDetail.name}</p>
                <p>
                  {ticket.venue.name}, {ticket.venue.city}, {ticket.venue.state}
                </p>
                <p>Price: {ticket.price}</p>
                <p>Tickets available: {ticket.quantity}</p>
              </div>
              <div className="ticket-quantity">
                <select value={quantity} onChange={handleSelect}>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                  <option>8</option>
                  <option>9</option>
                  <option>10</option>
                </select>
                <button>Add to Cart</button>
              </div>
            </form>
          );
        })}
    </div>
  );
};

export default Artists;
