import { useSearchParams } from "react-router-dom";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const result = searchParams.get("redirect_status");

  console.log("RESULT: ", result);

  return (
    <div className="home">
      <p>Home</p>
      {result === "succeeded" && (
        <div className="success">
          <h1>Order Successful!</h1>
        </div>
      )}
    </div>
  );
};

export default Home;
