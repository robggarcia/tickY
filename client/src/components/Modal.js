import { useEffect } from "react";
import { useState } from "react";
import "./Modal.css";

const Modal = ({ displayMessage, success }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (displayMessage) {
      setVisible(true);
      setTimeout(() => {
        setVisible(false);
      }, 5000);
    }
  }, [displayMessage]);

  return (
    <>
      {visible && (
        <div className={success ? "modal success" : "modal error"}>
          <p>{displayMessage}</p>
          <h3 className="close" onClick={() => setVisible(!visible)}>
            X
          </h3>
        </div>
      )}
    </>
  );
};

export default Modal;
