import type { Unsubscribe } from "firebase/firestore";
import { useSnackbar } from "notistack";
import { QRCodeCanvas } from "qrcode.react";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { Meet } from "../../interfaces";
import {
  getActiveMeet,
  getMeetById,
  logoutJudge,
} from "../../services/services";
import { JudgeRole, mapJudgeRole, VoteColor } from "../../utils";

interface JudgeVote {
  head: null | VoteColor;
  sideA: null | VoteColor;
  sideB: null | VoteColor;
}

const LightsDisplay: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preview = searchParams.get("preview") === "1";

  const [meet, setMeet] = useState<Meet | null>(null);
  const [loading, setLoading] = useState(true);

  const [lights, setLights] = useState<JudgeVote>({
    sideA: null,
    head: null,
    sideB: null,
  });

  useEffect(() => {
    let unsubscribe: Unsubscribe | undefined;

    const setupMeetListener = () => {
      setLoading(true);
      const meetId = getActiveMeet();
      if (!meetId) {
        enqueueSnackbar("Meet not found or an error occurred.", {
          variant: "error",
        });
        navigate("/create", { replace: true });
        setLoading(false);
        return;
      }

      unsubscribe = getMeetById(meetId, (currentMeet) => {
        if (currentMeet) {
          setMeet(currentMeet);
          // if (currentMeet.judges.length === 3) {
          const headId = currentMeet.judges.find(
            (judge) => judge.role === JudgeRole.Head
          )?.id;
          const sideAId = currentMeet.judges.find(
            (judge) => judge.role === JudgeRole.SideA
          )?.id;
          const sideBId = currentMeet.judges.find(
            (judge) => judge.role === JudgeRole.SideB
          )?.id;

          const headVote = currentMeet.votes.find(
            (vote) => vote.judgeId === headId
          );
          const sideAVote = currentMeet.votes.find(
            (vote) => vote.judgeId === sideAId
          );
          const sideBVote = currentMeet.votes.find(
            (vote) => vote.judgeId === sideBId
          );

          setLights({
            sideA: sideAVote?.value ?? null,
            head: headVote?.value ?? null,
            sideB: sideBVote?.value ?? null,
          });
          // }
        } else {
          setMeet(null);
          enqueueSnackbar("Meet not found or an error occurred.", {
            variant: "error",
          });
          navigate("/create", { replace: true });
        }
        setLoading(false);
      });
    };

    setupMeetListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [enqueueSnackbar, navigate]);

  const toggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message}`
        );
      });
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      {!preview && (
        <div
          className={`bg-gray-800 shadow-lg transition-all duration-300 flex flex-col ${
            isDrawerOpen ? "w-64" : "w-0"
          } ${isFullScreen ? "hidden" : ""}`}
        >
          {isDrawerOpen && (
            <>
              <div className="p-4 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white">{meet?.name}</h2>
              </div>

              <div className="p-4 flex flex-col items-center">
                <p className="text-gray-400 text-sm mb-2">Scan to connect:</p>
                <QRCodeCanvas
                  value={meet?.id || ""}
                  size={256}
                  level="H"
                  marginSize={8}
                />
                <p className="text-xs text-center text-gray-500 mt-2">
                  Open judge app on mobile device
                </p>
              </div>

              <div className="p-4 border-t border-gray-700">
                <h3 className="text-gray-300 font-medium mb-2">
                  Connected Judges
                </h3>
                <ul className="space-y-2">
                  {meet?.judges.map((judge) => (
                    <li
                      key={judge.id}
                      className="flex items-center justify-between"
                    >
                      <span className="text-gray-400">
                        {mapJudgeRole(judge.role)}
                      </span>
                      <button
                        className="text-gray-400 hover:text-red-500 cursor-pointer"
                        onClick={() => {
                          logoutJudge(meet?.id ?? "", judge.id);
                        }}
                        title="Remove judge"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
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
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <div
          className={`bg-gray-800 p-2 flex items-center ${
            isFullScreen ? "hidden" : ""
          }`}
        >
          {!preview && (
            <button
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="text-gray-400 hover:text-white p-2"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}
          <div className="flex-1"></div>
          <button
            onClick={toggleFullScreen}
            className="text-gray-400 hover:text-white p-2"
            title={isFullScreen ? "Exit full screen" : "Enter full screen"}
          >
            {isFullScreen ? (
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
            ) : (
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
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                />
              </svg>
            )}
          </button>
        </div>

        <div className="flex-1 flex justify-center items-center p-4">
          <div
            className={`flex justify-around items-start gap-8 sm:gap-16 transition-all duration-300 ${
              isFullScreen ? "scale-150" : ""
            }`}
          >
            {Object.entries(lights).map(([, value], index) => (
              <div key={index} className="flex flex-col items-center space-y-4">
                <div
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-gray-600 transition-colors duration-500 cursor-pointer ${
                    value ? "bg-white" : "bg-gray-500"
                  }`}
                />

                <div
                  className={`w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full border-4 border-gray-600 transition-all duration-500 cursor-pointer transform hover:scale-105 flex items-center justify-center shadow-lg ${
                    !value || !(lights.head && lights.sideA && lights.sideB)
                      ? "bg-gray-600"
                      : value === "white"
                      ? "bg-white"
                      : "bg-red-600"
                  }`}
                ></div>

                <div
                  className={`w-8 h-4 sm:w-12 sm:h-6 md:w-16 md:h-8 rounded-md transition-colors duration-500 cursor-pointer ${
                    !meet?.useYellowBlue ||
                    !(lights.head && lights.sideA && lights.sideB)
                      ? "bg-gray-600"
                      : value === "yellow"
                      ? "bg-yellow-400"
                      : value === "blue"
                      ? "bg-blue-500"
                      : "bg-gray-600"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {isFullScreen && (
        <button
          onClick={toggleFullScreen}
          className="fixed top-2 right-2 text-gray-400 hover:text-white p-2 z-50 bg-gray-800 bg-opacity-50 rounded-full"
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
      )}
    </div>
  );
};

export default LightsDisplay;
