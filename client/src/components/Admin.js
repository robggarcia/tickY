import React from "react";
import { useState, useEffect } from "react";
import { grabAllUsers } from "../api";
import { updateUser, adminUpdateTicket, updateArtist } from "../api";

// const Admin = ({ user, venues, artists, tickets }) => {
//   const [isShown, setIsShown] = useState(false);

//   const testButton = (event) => {
//     setIsShown(true);
//   };

//   const fetchUsersAdmin = async (e) => {
//     setIsShown(true);
//   };

//   const fetchTicketsAdmin = async (e) => {};

//   const fetchArtistsAdmin = async (e) => {};

//   const fetchVenuesAdmin = async (e) => {};

//   return (
//     <div>
//       <h1>Admin Dashboard</h1>
//       <div className="admin-sidebar">
//         <button onClick={fetchUsersAdmin}>Users</button>
//         {isShown && (
//           <div>
//             <h2>Users button works!</h2>
//           </div>
//         )}
//         <button>Tickets</button>
//         <button>Artists</button>
//         <button>Venues</button>
//         <button onClick={testButton}>Test</button>
//         {isShown && (
//           <div>
//             <h2>Hi</h2>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Admin;
