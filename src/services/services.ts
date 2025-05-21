import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import type { Judge, Meet, Vote } from "../interfaces";

export const setActiveMeet = (meetId: string) => {
  sessionStorage.setItem("activeMeet", meetId);
};

export const getActiveMeet = () => {
  return sessionStorage.getItem("activeMeet");
};

export const clearActiveMeet = () => {
  sessionStorage.removeItem("activeMeet");
};

export const setJudge = (judgeId: string) => {
  sessionStorage.setItem("judgeId", judgeId);
};

export const getJudge = () => {
  return sessionStorage.getItem("judgeId");
};

export const clearJudge = () => {
  sessionStorage.removeItem("judgeId");
};

export const createMeet = async (meet: Meet) => {
  const meetRef = doc(db, "meets", meet.id);
  await setDoc(meetRef, meet);
};

export const getMeets = async () => {
  const meetRef = collection(db, "meets");
  const snapshot = await getDocs(meetRef);
  return snapshot.docs.map((doc) => doc.data() as Meet);
};

export const getMeetById = (
  id: string,
  callback: (meet: Meet | null) => void
) => {
  const meetRef = doc(db, "meets", id);
  const unsubscribe = onSnapshot(
    meetRef,
    (doc) => {
      if (doc.exists()) {
        callback(doc.data() as Meet);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error("Error fetching meet in real-time:", error);
      callback(null);
    }
  );
  return unsubscribe;
};

export const connectJudge = async (meetId: string, judge: Judge) => {
  const meetRef = doc(db, "meets", meetId);
  const meetDoc = await getDoc(meetRef);
  if (!meetDoc.exists()) {
    throw new Error("Meet not found");
  }
  const meet = meetDoc.data() as Meet;
  await updateDoc(meetRef, {
    judges: [...meet.judges, judge],
  });
};

export const submitVote = async (meetId: string, vote: Vote) => {
  const meetRef = doc(db, "meets", meetId);
  const meetDoc = await getDoc(meetRef);
  if (!meetDoc.exists()) {
    throw new Error("Meet not found");
  }
  const meet = meetDoc.data() as Meet;
  await updateDoc(meetRef, {
    votes: [...meet.votes, vote],
  });
};

export const resetVotes = async (meetId: string) => {
  const meetRef = doc(db, "meets", meetId);
  await updateDoc(meetRef, {
    votes: [],
  });
};

export const logoutJudge = async (meetId: string, judgeId: string) => {
  const meetRef = doc(db, "meets", meetId);
  const meetDoc = await getDoc(meetRef);
  if (!meetDoc.exists()) {
    throw new Error("Meet not found");
  }
  const meet = meetDoc.data() as Meet;
  await updateDoc(meetRef, {
    judges: meet.judges.filter((judge) => judge.id !== judgeId),
    votes: meet.votes.filter((vote) => vote.judgeId !== judgeId),
  });
};
