import { useLongPress } from "../hooks/useLongProgress";
import { VoteColor } from "../utils";
import { ProgressRing } from "./ProgressRing";

interface ButtonStyle {
  bg: string;
  activeBg: string;
  textColor: string;
}

interface VoteButtonProps {
  color: VoteColor;
  isSubmitted: boolean;
  disabled: boolean;
  onVote: (color: VoteColor) => void;
}

export const VoteButton: React.FC<VoteButtonProps> = ({
  color,
  isSubmitted,
  onVote,
  disabled,
}) => {
  const { pressing, progress, handlers } = useLongPress(() => onVote(color));

  // Configure button styling based on color
  const getButtonStyle = (): ButtonStyle => {
    switch (color) {
      case VoteColor.White:
        return {
          bg: "bg-white",
          activeBg: "active:bg-gray-200",
          textColor: "text-gray-800",
        };
      case VoteColor.Red:
        return {
          bg: "bg-red-600",
          activeBg: "active:bg-red-700",
          textColor: "text-white",
        };
      case VoteColor.Yellow:
        return {
          bg: "bg-yellow-400",
          activeBg: "active:bg-yellow-500",
          textColor: "text-gray-800",
        };
      case VoteColor.Blue:
        return {
          bg: "bg-blue-500",
          activeBg: "active:bg-blue-600",
          textColor: "text-white",
        };
      default:
        return {
          bg: "bg-gray-500",
          activeBg: "active:bg-gray-600",
          textColor: "text-white",
        };
    }
  };

  const { bg, activeBg, textColor } = getButtonStyle();

  return (
    <div
      className={`relative ${bg} ${activeBg} flex items-center justify-center 
        ${pressing ? "opacity-80" : "opacity-100"} 
        ${isSubmitted ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      {...handlers}
      {...(disabled ? { onClick: undefined } : {})}
    >
      {pressing && <ProgressRing progress={progress} />}
      <span className={`text-3xl font-bold ${textColor} select-none`}>
        {color.charAt(0).toUpperCase() + color.slice(1)}
      </span>
    </div>
  );
};
