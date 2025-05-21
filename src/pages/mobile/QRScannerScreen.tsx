import { Scanner, type IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { useSnackbar } from "notistack";
import React, { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { JudgeRole } from "../../utils";
import type { Judge, Meet } from "../../interfaces";
import {
  connectJudge,
  getMeetById,
  setActiveMeet,
  setJudge,
} from "../../services/services";

type RoleSelectProps = {
  isOpen: boolean;
  judges: Judge[];
  onSelect: (role: string) => void;
};

const RoleSelectBottomSheet: React.FC<RoleSelectProps> = ({
  isOpen,
  judges,
  onSelect,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
      <div
        className="bg-gray-800 w-full rounded-t-xl p-5 transform transition-transform duration-300 ease-out"
        style={{ maxHeight: "70vh" }}
      >
        <div className="w-16 h-1 bg-gray-500 rounded-full mx-auto mb-5"></div>
        <h3 className="text-white text-xl font-bold mb-5 text-center">
          Select Your Role
        </h3>

        <div className="space-y-3">
          <button
            onClick={() => onSelect(JudgeRole.Head)}
            disabled={judges.some((judge) => judge.role === JudgeRole.Head)}
            className="w-full bg-blue-600 text-white p-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Head Judge
          </button>
          <button
            onClick={() => onSelect(JudgeRole.SideA)}
            disabled={judges.some((judge) => judge.role === JudgeRole.SideA)}
            className="w-full bg-blue-600 text-white p-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Side Judge A
          </button>
          <button
            onClick={() => onSelect(JudgeRole.SideB)}
            disabled={judges.some((judge) => judge.role === JudgeRole.SideB)}
            className="w-full bg-blue-600 text-white p-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Side Judge B
          </button>
        </div>
      </div>
    </div>
  );
};

const QRScannerScreen: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [showRoleSelect, setShowRoleSelect] = useState(false);
  const [meet, setMeet] = useState<Meet | null>(null);

  const handleScan = (result: IDetectedBarcode[]) => {
    if (result && !scannedData) {
      // Play a success sound if available
      try {
        // Create a short beep sound
        const audioContext = new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: AudioContext })
            .webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note
        oscillator.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2); // Short beep

        // Vibrate if available
        if (navigator.vibrate) {
          navigator.vibrate(200);
        }
      } catch (e) {
        console.error("Error playing sound:", e);
      }

      setScannedData(result[0].rawValue);
      setShowRoleSelect(true);
    }
  };

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
          setActiveMeet(meet.id);
          setMeet(meet);
        });
        return () => unsubscribe();
      }
    };
    if (scannedData) {
      fetchMeet(scannedData);
    }
  }, [enqueueSnackbar, scannedData]);

  const handleRoleSelect = useCallback(
    async (role: string) => {
      if (meet) {
        const newJudge: Judge = {
          id: uuidv4(),
          role: role as Judge["role"],
        };
        await connectJudge(meet.id, newJudge);
        setJudge(newJudge.id);
      }
    },
    [meet]
  );

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      <div className="p-4 bg-gray-800">
        <h1 className="text-2xl font-bold text-white text-center">
          Scan Meet QR Code To Start
        </h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md mb-4">
          <div className="relative rounded-xl overflow-hidden mb-4 aspect-square">
            {!scannedData ? (
              <Scanner
                scanDelay={500}
                onScan={(result) => handleScan(result)}
                onError={(error) => console.error("Error scanning:", error)}
              />
            ) : (
              <div className="bg-gray-800 w-full h-full flex items-center justify-center">
                <div className="text-green-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-24 w-24"
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
                </div>
              </div>
            )}
          </div>

          <p className="text-gray-400 text-center">
            {scannedData
              ? "QR Code scanned successfully! Select your role."
              : "Position the QR code within the frame to scan"}
          </p>
        </div>
      </div>

      <RoleSelectBottomSheet
        isOpen={showRoleSelect}
        onSelect={handleRoleSelect}
        judges={meet?.judges ?? []}
      />
    </div>
  );
};

export default QRScannerScreen;
