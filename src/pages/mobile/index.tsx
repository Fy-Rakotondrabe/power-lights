import React from "react";
import { Outlet } from "react-router-dom";

const MobileApp: React.FC = () => {
  return (
    <div className="h-screen bg-gray-900">
      <Outlet />
    </div>
  );
};

export default MobileApp;
