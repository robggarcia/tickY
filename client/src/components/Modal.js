import { useEffect } from "react";
import { useState } from "react";
import "../styles/Modal.css";

const Modal = ({ displayMessage, success }) => {
  const [visible, setVisible] = useState(false);
  // console.log("visible", visible);
  // console.log(displayMessage);

  useEffect(() => {
    if (displayMessage) {
      setVisible(true);
      setTimeout(() => {
        setVisible(false);
      }, 10000);
    }
  }, [displayMessage]);

  return (
    <div className="modal-container">
      {visible && (
        <div className={success ? "modal success" : "modal error"}>
          <p>{displayMessage}</p>
          <h3 className="close" onClick={() => setVisible(!visible)}>
            X
          </h3>
        </div>
      )}
    </div>
  );
};

export default Modal;
