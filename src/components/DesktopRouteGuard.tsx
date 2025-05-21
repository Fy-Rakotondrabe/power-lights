import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface DesktopRouteGuardProps {
  isMobile: boolean;
}

const DesktopRouteGuard: React.FC<DesktopRouteGuardProps> = ({ isMobile }) => {
  if (isMobile) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default DesktopRouteGuard;
