module.exports = {
  ArtistExistsError: (name) => `An artist with name ${name} already exists`,
  ArtistNotFoundError: (id) => `Artist ${id} not found`,
  VenueExistsError: (name) => `A venue with name ${name} already exists`,
  VenueNotFoundError: (id) => `Venue ${id} not found`,
  UnauthorizedError: () => "You must be logged in to perform this action",
  UnauthorizedUpdateError: (username, name) =>
    `User ${username} is not allowed to update ${name}`,
  UnauthorizedDeleteError: (username, name) =>
    `User ${username} is not allowed to delete ${name}`,
  DuplicateTicketOrderError: (ticketId, orderId) =>
    `Ticket ID ${ticketId} already exists in Order ID ${orderId}`,
  UserDoesNotExistError: (name) => `User ${name} does not exist`,
  PasswordTooShortError: () => `Password Too Short!`,
  UserTakenError: (email) => `User ${email} is already taken.`,
  UserAccessError: (id) =>
    `User id ${id} does not have access to edit this profile`,
  NonExistingOrderError: (id) => `Order ${id} not found`,
  TicketNotFoundError: (id) => `Ticket ${id} not found`,
  ExistingTicketError: (date) =>
    `A ticket with artist and venue on date ${date} already exists`,
};
