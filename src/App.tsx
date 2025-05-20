import "./App.css";
import DesktopApp from "./layout/Desktop";
import MobileApp from "./layout/Mobile";
import { useResponsive } from "./hooks/useResponsive";

function App() {
  const { isMobile } = useResponsive();

  return <>{isMobile ? <MobileApp /> : <DesktopApp />}</>;
}

export default App;
