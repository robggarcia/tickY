import Nav from "./Nav";

const Profile = ({ user, myOrders }) => {
  if (!user.username) return <></>;

  return (
    <>
      <div className="profile">
        <h1>Welcome {user.username}!</h1>
        <div className="order-history">
          <h2>Order History</h2>
        </div>
      </div>
    </>
  );
};

export default Profile;
