module.exports = {
  ArtistExistsError: (name) => `An artist with name ${name} already exists`,
  ArtistNotFoundError: (id) => `Artist ${id} not found`,
  UnauthorizedError: () => "You must be logged in to perform this action",
  UnauthorizedUpdateError: (username, name) =>
    `User ${username} is not allowed to update ${name}`,
  UnauthorizedDeleteError: (username, name) =>
    `User ${username} is not allowed to delete ${name}`,
  DuplicateTicketOrderError: (ticketId, orderId) =>
    `Ticket ID ${ticketId} already exists in Order ID ${orderId}`,
  UserDoesNotExistError: (name) => `User ${name} does not exist`,
  PasswordTooShortError: () => `Password Too Short!`,
  UserTakenError: (name) => `User ${name} is already taken.`,
};
