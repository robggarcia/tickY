import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Suggest.css";

const Suggest = ({ suggest }) => {
  console.log("suggest", suggest);

  useEffect(() => {}, [suggest]);

  return (
    <>
      {suggest.length > 0 && (
        <div className="suggest">
          <p>Suggested Artists:</p>
          <ul>
            {suggest.map((artist, idx) => {
              return (
                <li key={idx}>
                  <Link>{artist}</Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
};

export default Suggest;
