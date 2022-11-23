// USER
export const fetchUser = async (token) => {
  try {
    const response = await fetch(`api/users/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const info = await response.json();
    return info;
  } catch (error) {
    console.error(error);
  }
};

// ARTISTS
export const fetchArtists = async () => {
  try {
    const response = await fetch(`api/artists`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

// VENUES
export const fetchVenues = async () => {
  try {
    const response = await fetch(`api/venues`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

// TICKETS
export const fetchTickets = async () => {
  try {
    const response = await fetch(`api/tickets`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

// ORDERS
export const fetchUsersOrders = async (token, userId) => {
  try {
    const response = await fetch(`api/users/${userId}/orders`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const createOrder = async (token, userId) => {
  const purchased = false;
  try {
    const response = await fetch(`api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId,
        purchased,
      }),
    });
    const data = response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const createTicketOrder = async (token, orderId, ticketId, quantity) => {
  try {
    const response = await fetch(`api/tickets_orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        orderId,
        ticketId,
        quantity,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const monthByNumber = (num) => {
  switch (`${num}`) {
    case "01":
      return "JAN";
    case "02":
      return "FEB";
    case "03":
      return "MAR";
    case "04":
      return "APR";
    case "05":
      return "MAY";
    case "06":
      return "JUN";
    case "07":
      return "JUL";
    case "08":
      return "AUG";
    case "09":
      return "SEP";
    case "10":
      return "OCT";
    case "11":
      return "NOV";
    default:
      return "DEC";
  }
};
