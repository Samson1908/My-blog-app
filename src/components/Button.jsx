import React from "react";

const Button = ({ label, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;
