import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import type { Meet } from "../../interfaces";
import { createMeet, setActiveMeet } from "../../services/services";
import MeetsDrawer from "./Meets";

const CreateMeet: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [meetName, setMeetName] = useState("");
  const [useYellowBlue, setUseYellowBlue] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [meetsDrawerOpen, setMeetsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newMeet: Meet = {
        id: uuidv4(),
        name: meetName,
        useYellowBlue,
        createdAt: new Date(),
        updatedAt: new Date(),
        judges: [],
        votes: [],
      };

      await createMeet(newMeet);
      await setActiveMeet(newMeet.id);

      navigate("/desktop/lights");
    } catch (error) {
      enqueueSnackbar("Failed to create meet. Please try again.", {
        variant: "error",
      });
      console.error("Failed to create meet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMeetsDrawer = () => {
    setMeetsDrawerOpen(!meetsDrawerOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <button
        onClick={toggleMeetsDrawer}
        className="fixed top-4 left-4 p-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white transition-colors duration-200 flex items-center space-x-2 z-30"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        <span>View Meets</span>
      </button>

      <MeetsDrawer
        isOpen={meetsDrawerOpen}
        onClose={() => setMeetsDrawerOpen(false)}
      />

      <div className="max-w-md mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Launch New Meet
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="meetName"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Meet Name
              </label>
              <input
                type="text"
                id="meetName"
                value={meetName}
                onChange={(e) => setMeetName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 outline-none"
                placeholder="Enter meet name"
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="useYellowBlue"
                checked={useYellowBlue}
                onChange={(e) => setUseYellowBlue(e.target.checked)}
                className="h-5 w-5 text-blue-400 rounded focus:ring-blue-500 cursor-pointer"
                disabled={isLoading}
              />
              <label
                htmlFor="useYellowBlue"
                className="ml-3 block text-sm font-medium text-gray-300"
              >
                Use yellow and blue light
              </label>
            </div>

            <div className="bg-blue-900/30 rounded-lg p-4 mt-6">
              <p className="text-sm text-blue-300">
                <span className="font-semibold">Note:</span> If you want to use
                the judge app, open the link on mobile
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create Meet"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateMeet;
