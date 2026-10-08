import { createContext, useContext } from "react";

// State of the submit lifecycle, shaped as a discriminated union on `status`.
export type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "done" }
  | { status: "copied" } // nobody is waiting, the response went to the clipboard
  | { status: "error"; message: string };

export type SubmitContextValue = {
  state: SubmitState;
  live: boolean; // an agent is waiting for the answer, otherwise submit copies it
  submit: (result: unknown) => void;
};

const SubmitContext = createContext<SubmitContextValue | null>(null);

export const SubmitProvider = SubmitContext.Provider;

export function useSubmit(): SubmitContextValue {
  const ctx = useContext(SubmitContext);
  if (!ctx) throw new Error("useSubmit used outside SubmitProvider");
  return ctx;
}
