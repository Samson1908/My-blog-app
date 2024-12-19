import React from "react";

const Card = ({ title, children }) => {
  return (
    <div className="p-4 border rounded shadow-md bg-white">
      <h2 className="text-lg font-bold mb-2">{title}</h2>
      {children}
    </div>
  );
};

export default Card;
