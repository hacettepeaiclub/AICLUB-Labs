import { createContext, useContext } from "react";

export const JourneyContext = createContext("");
export const useJourneySlug = () => useContext(JourneyContext);
