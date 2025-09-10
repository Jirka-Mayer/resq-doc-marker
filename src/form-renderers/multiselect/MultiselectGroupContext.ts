import { createContext } from "react";

export interface MultiselectGroupContextState {
  leaderValue: any;
  leaderPath: string;
  inSubGroup: boolean;
  isGroupVisible: boolean;
}

export const MultiselectGroupContext =
  createContext<MultiselectGroupContextState>({
    leaderValue: undefined,
    leaderPath: "",
    inSubGroup: false,
    isGroupVisible: true,
  });
