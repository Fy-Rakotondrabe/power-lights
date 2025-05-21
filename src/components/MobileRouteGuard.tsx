import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface MobileRouteGuardProps {
  isMobile: boolean;
}

const MobileRouteGuard: React.FC<MobileRouteGuardProps> = ({ isMobile }) => {
  if (!isMobile) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default MobileRouteGuard;
