import type { Judge } from "./interfaces";

export enum JudgeRole {
  Head = "head",
  SideA = "sideA",
  SideB = "sideB",
}

export enum VoteColor {
  White = "white",
  Red = "red",
  Yellow = "yellow",
  Blue = "blue",
}

export const mapJudgeRole = (role: Judge["role"]) => {
  switch (role) {
    case JudgeRole.Head:
      return "Head Judge";
    case JudgeRole.SideA:
      return "Side Judge A";
    case JudgeRole.SideB:
      return "Side Judge B";
  }
};
