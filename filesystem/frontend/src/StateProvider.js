import { createContext, useContext, useReducer } from "react";

export const SetContext = createContext();

export const GlobalProvider = ({ reducer, initialState, children }) => (
  <SetContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </SetContext.Provider>
);

export const useGlobalState = () => useContext(SetContext);
