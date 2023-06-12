import { Dispatch, createContext, useReducer } from 'react';
import { initialState } from '../constants/constants';
import ProjectState from '../entities/ProjectState';
import projectReducer, { Action } from '../reducers/projectReducer';
import React from 'react';

interface StateContextContainer {
  state: ProjectState;
  dispatch: Dispatch<Action>;
}

interface ContextProps {
  children: React.ReactNode;
}

export const StateContext = createContext<StateContextContainer>({
  state: initialState,
  dispatch: () => null,
});

const StateProvider: React.FC<ContextProps> = ({ children }) => {
  const [state, dispatch] = useReducer(projectReducer, initialState);

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
};

export { StateProvider };
