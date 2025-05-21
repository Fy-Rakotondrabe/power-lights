import { useSnackbar } from "notistack";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { animated, useSpring } from "react-spring";
import { v4 as uuidv4 } from "uuid";
import { VoteButton } from "../../components/VoteButton";
import type { Judge, Meet } from "../../interfaces";
import {
  clearActiveMeet,
  clearJudge,
  getActiveMeet,
  getJudge,
  getMeetById,
  resetVotes,
  submitVote,
} from "../../services/services";
import { JudgeRole, mapJudgeRole, VoteColor } from "../../utils";

const JudgingScreen: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [currentVote, setCurrentVote] = useState<VoteColor | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [resetPressed, setResetPressed] = useState(false);
  const [meet, setMeet] = useState<Meet | null>(null);
  const [judge, setJudge] = useState<Judge | null>(null);
  const [showWaitModal, setShowWaitModal] = useState(false);
  const judgeId = getJudge();

  const [submitSpring, setSubmitSpring] = useSpring(() => ({
    scale: 0,
    opacity: 0,
  }));

  useEffect(() => {
    const fetchMeet = async (meetId: string) => {
      if (meetId) {
        const unsubscribe = getMeetById(meetId, (meet) => {
          if (!meet) {
            enqueueSnackbar("Meet not found", {
              variant: "error",
            });
            return;
          }
          setMeet(meet);
          setJudge(meet.judges.find((judge) => judge.id === judgeId) ?? null);
          if (meet.votes.length === 0) {
            setShowWaitModal(false);
          }
        });
        return () => unsubscribe();
      }
    };
    const meetId = getActiveMeet();
    if (meetId) {
      fetchMeet(meetId);
    }
  }, [enqueueSnackbar, judgeId]);

  const handleVote = useCallback(
    async (color: VoteColor) => {
      if (submitted) return;

      setCurrentVote(color);
      setSubmitted(true);

      const judgeConnected = meet?.judges.find((judge) => judge.id === judgeId);
      if (judgeConnected) {
        await submitVote(meet?.id ?? "", {
          id: uuidv4(),
          judgeId: judgeConnected.id,
          value: color,
        });
      } else {
        enqueueSnackbar(
          "Judge not connected to this meet or removed by admin",
          {
            variant: "error",
          }
        );
        navigate("/");
        clearJudge();
        clearActiveMeet();
      }

      setShowWaitModal(true);
      setSubmitted(false);

      setSubmitSpring({
        scale: 1.2,
        opacity: 1,
        onRest: () => {
          setSubmitSpring({
            scale: 1,
            opacity: 0,
            delay: 800,
          });
        },
      });
    },
    [
      enqueueSnackbar,
      judgeId,
      meet?.id,
      meet?.judges,
      navigate,
      setSubmitSpring,
      submitted,
    ]
  );

  const handleReset = useCallback(async () => {
    if (resetPressed) return;

    setResetPressed(true);

    if (navigator.vibrate) {
      navigator.vibrate([50, 100, 50]);
    }
    await resetVotes(meet?.id ?? "");
    setShowWaitModal(false);

    setSubmitSpring({
      scale: 1.2,
      opacity: 1,
      onRest: () => {
        setSubmitSpring({
          scale: 1,
          opacity: 0,
          delay: 500,
        });
      },
    });
    setResetPressed(false);
  }, [meet?.id, resetPressed, setSubmitSpring]);

  const getGridCols = () => {
    return meet?.useYellowBlue ? "grid-cols-2" : "grid-cols-1";
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      <div className="p-4 bg-gray-800 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">
          {mapJudgeRole(judge?.role ?? JudgeRole.Head)}
        </h1>
        {currentVote && (
          <>
            <div className="flex items-center space-x-2">
              <div
                className={`w-4 h-4 rounded-full ${
                  currentVote === VoteColor.White
                    ? "bg-white"
                    : currentVote === VoteColor.Red
                    ? "bg-red-600"
                    : currentVote === VoteColor.Yellow
                    ? "bg-yellow-400"
                    : "bg-blue-500"
                }`}
              ></div>
              <span className="text-white">Vote Submitted</span>
            </div>
          </>
        )}
      </div>

      <div className={`flex-1 grid ${getGridCols()} gap-1 p-1 relative`}>
        <VoteButton
          color={VoteColor.White}
          isSubmitted={submitted}
          onVote={handleVote}
          disabled={meet?.votes.length === 3}
        />
        <VoteButton
          color={VoteColor.Red}
          isSubmitted={submitted}
          onVote={handleVote}
          disabled={meet?.votes.length === 3}
        />

        {meet?.useYellowBlue && (
          <>
            <VoteButton
              color={VoteColor.Yellow}
              isSubmitted={submitted}
              onVote={handleVote}
              disabled={meet?.votes.length === 3}
            />
            <VoteButton
              color={VoteColor.Blue}
              isSubmitted={submitted}
              onVote={handleVote}
              disabled={meet?.votes.length === 3}
            />
          </>
        )}
      </div>

      {/* Submission animation */}
      <animated.div
        style={{
          scale: submitSpring.scale,
          opacity: submitSpring.opacity,
        }}
        className="fixed inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="bg-white bg-opacity-20 rounded-full p-16">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-24 w-24 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </animated.div>

      {showWaitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-green-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h2 className="text-xl font-bold text-white mb-2">
              Vote submitted
            </h2>
            {judge?.role === JudgeRole.Head ? (
              <button
                onClick={handleReset}
                className="bg-transparent text-white px-4 py-2 rounded-md border border-white"
              >
                Next Athlete;
              </button>
            ) : (
              <p className="text-gray-300">Please wait for the next athletes</p>
            )}
          </div>
        </div>
      )}

      {/* Long press instructions */}
      <div className="py-3 px-4 bg-gray-800 text-gray-400 text-center text-sm">
        Press and hold a button to submit your vote
      </div>
    </div>
  );
};

export default JudgingScreen;
