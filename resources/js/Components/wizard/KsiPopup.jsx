import React from "react";

const KsiPopup = ({ children }) => {
  return (
    <div className="ksi-popup">
      <div className="ksi-popup-content">{children}</div>
    </div>
  );
};

export default KsiPopup;
