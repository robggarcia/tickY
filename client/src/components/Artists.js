const Artists = ({ artistPage, tickets }) => {
  const allArtistsTicket = tickets.filter((ticket) => {
    if (ticket.artistId === artistPage.id) {
      return ticket;
    }
  });

  console.log(artistPage);
  console.log(tickets);
  console.log(allArtistsTicket);
  return (
    <div className="artist-detail">
      <h1>{artistPage.name}</h1>
      <img
        className="artistImage"
        src={artistPage.image}
        alt={artistPage.name}
      />
      <p>{artistPage.description}</p>
      <h3>Tickets</h3>
      {allArtistsTicket.map((ticket) => {
        return (
          <div className="tickets" key={ticket.id}>
            <div className="ticket-date">
              <p>{ticket.date}</p>
            </div>
            <div className="ticket-info">
              <p>{artistPage.name}</p>
              <p>
                {ticket.venue.name}, {ticket.venue.city}, {ticket.venue.state}
              </p>
              <p>Price: {ticket.price}</p>
              <p>Tickets available: {ticket.quantity}</p>
            </div>
            <div className="ticket-quantity">
              <select>
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
          </div>
        );
      })}
    </div>
  );
};

export default Artists;
