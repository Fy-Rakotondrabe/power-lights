import React from "react";
import { Outlet } from "react-router-dom";
// Removed useEffect, useState, Navigate, getActiveMeet, LightsDisplay imports
// CreateMeet will be routed in App.tsx

const DesktopApp: React.FC = () => {
  // The logic for activeMeet and conditional rendering of LightsDisplay
  // has been moved to LightsPageRoute.tsx

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Outlet /> {/* Nested routes will be rendered here */}
    </div>
  );
};

export default DesktopApp;
