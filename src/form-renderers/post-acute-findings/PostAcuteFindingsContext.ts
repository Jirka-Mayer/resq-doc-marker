import { createContext } from "react";

export interface PostAcuteFindingsContextState {
  readonly groupVisible: boolean;
}

export const PostAcuteFindingsContext =
  createContext<PostAcuteFindingsContextState>({
    groupVisible: true,
  });
