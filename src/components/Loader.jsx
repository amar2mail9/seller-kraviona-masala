import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center w-full h-full py-10">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="ml-4 text-gray-400 font-medium">Loading...</p>
    </div>
  );
};

export default Loader;
