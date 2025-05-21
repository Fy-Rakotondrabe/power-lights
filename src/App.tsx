import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./App.css";
import { useResponsive } from "./hooks/useResponsive";
import DesktopApp from "./pages/desktop";
import MobileApp from "./pages/mobile";

import DesktopRouteGuard from "./components/DesktopRouteGuard";
import MobileRouteGuard from "./components/MobileRouteGuard";
import CreateMeet from "./pages/desktop/CreateMeet";
import LightsPageRoute from "./pages/desktop/LightsPageRoute";
import JudgingScreen from "./pages/mobile/JudgingScreen";
import QRScannerScreen from "./pages/mobile/QRScannerScreen";

function App() {
  const { isMobile } = useResponsive();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to={isMobile ? "/mobile/scan" : "/desktop/create"}
              replace
            />
          }
        />

        <Route element={<MobileRouteGuard isMobile={isMobile} />}>
          <Route path="/mobile" element={<MobileApp />}>
            <Route path="scan" element={<QRScannerScreen />} />
            <Route path="judge" element={<JudgingScreen />} />
            <Route index element={<Navigate to="scan" replace />} />
          </Route>
        </Route>

        <Route element={<DesktopRouteGuard isMobile={isMobile} />}>
          <Route path="/desktop" element={<DesktopApp />}>
            <Route path="create" element={<CreateMeet />} />
            <Route path="lights" element={<LightsPageRoute />} />
            <Route index element={<Navigate to="create" replace />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
