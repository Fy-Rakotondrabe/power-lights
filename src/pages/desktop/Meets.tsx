import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMeets, setActiveMeet } from "../../services/services";
import type { Meet } from "../../interfaces";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";
import { useSnackbar } from "notistack";

interface MeetsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MeetsDrawer: React.FC<MeetsDrawerProps> = ({ isOpen, onClose }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [meets, setMeets] = useState<Meet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeets = async () => {
      try {
        setIsLoading(true);
        const fetchedMeets = await getMeets();
        setMeets(fetchedMeets);
        setError(null);
      } catch (err) {
        enqueueSnackbar("Failed to load meets. Please try again.", {
          variant: "error",
        });
        console.error("Error fetching meets:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchMeets();
    }
  }, [enqueueSnackbar, isOpen]);

  const handleResumeMeet = (meet: Meet) => {
    try {
      setActiveMeet(meet.id);
      navigate("/desktop/lights");
    } catch (err) {
      setError("Failed to resume meet. Please try again.");
      console.error("Error resuming meet:", err);
    }
  };

  const handleViewMeet = (meet: Meet) => {
    setActiveMeet(meet.id);
    navigate("/desktop/lights?preview=1");
  };

  const isToday = (dateInput: Date | string) => {
    return dayjs(dateInput).isSame(dayjs(), "day");
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-40 w-80 bg-gray-800 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } overflow-hidden flex flex-col`}
      >
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Your Meets</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-full focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-400 p-3 rounded-md bg-red-900/20">
              {error}
            </div>
          ) : meets.length === 0 ? (
            <div className="text-gray-400 text-center p-4">
              No meets found. Create your first meet!
            </div>
          ) : (
            <ul className="space-y-3">
              {meets.map((meet) => {
                const createdAt =
                  meet.createdAt instanceof Timestamp
                    ? (meet.createdAt as Timestamp).toDate()
                    : meet.createdAt;
                return (
                  <li
                    key={meet.id}
                    className="bg-gray-700 rounded-lg p-4 hover:bg-gray-650 transition-colors duration-200"
                  >
                    <div className="flex justify-between">
                      <h3 className="text-white font-medium">{meet.name}</h3>
                      {isToday(createdAt) && (
                        <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                          Today
                        </span>
                      )}
                    </div>
                    <div className="text-gray-400 text-sm mt-1">
                      Created: {dayjs(createdAt).format("MMM D, YYYY")}
                    </div>

                    <div className="flex justify-between h-13 gap-2">
                      {isToday(createdAt) && (
                        <>
                          <button
                            onClick={() => handleResumeMeet(meet)}
                            className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200"
                          >
                            Resume
                          </button>
                          <button
                            onClick={() => handleViewMeet(meet)}
                            className="mt-3 w-full bg-transparent text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200 outline outline-2 outline-blue-600"
                          >
                            View
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="p-4 border-t border-gray-700 bg-gray-800">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default MeetsDrawer;
