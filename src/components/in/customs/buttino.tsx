import React, { ReactNode } from "react";

interface ButtonTypes {
  children: ReactNode;
}

const Buttino: React.FC<ButtonTypes> = ({ children }) => {
  return (
    <button className="bg-green-800 text-white px-4 py-2 rounded">
      {children}
    </button>
  );
};

export default Buttino;
