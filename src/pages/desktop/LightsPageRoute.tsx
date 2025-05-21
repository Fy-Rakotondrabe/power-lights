import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getActiveMeet } from "../../services/services";
import LightsDisplay from "./LightsDisplay";

const LightsPageRoute: React.FC = () => {
  const [activeMeet, setActiveMeet] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveMeet = async () => {
      try {
        const activeMeetId = await getActiveMeet();
        setActiveMeet(activeMeetId);
      } catch (error) {
        console.error("Failed to fetch active meet:", error);
        // Optionally, handle the error state in the UI
      } finally {
        setLoading(false);
      }
    };
    fetchActiveMeet();
  }, []);

  if (loading) {
    // You might want to return a loading spinner here
    return <div>Loading...</div>;
  }

  return activeMeet ? (
    <LightsDisplay />
  ) : (
    <Navigate to="/desktop/create" replace />
  );
};

export default LightsPageRoute;
