import type { Timestamp } from "firebase/firestore";
import type { JudgeRole } from "../utils";
import type { VoteColor } from "../utils";

export interface Meet {
  id: string;
  name: string;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
  useYellowBlue: boolean;
  judges: Judge[];
  votes: Vote[];
}

export interface Judge {
  id: string;
  role: JudgeRole;
}

export interface Vote {
  id: string;
  judgeId: string;
  value: VoteColor;
}
