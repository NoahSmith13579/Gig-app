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

interface StateContextObjProps {
  state: ProjectState;
  dispatch: Dispatch<Action>;
  StateContext: React.Context<StateContextContainer>;
}

const StateContextObj = (): StateContextObjProps => {
  const [state, dispatch] = useReducer(projectReducer, initialState);

  const StateContext = createContext<StateContextContainer>({
    state: initialState,
    dispatch: dispatch,
  });
  return { state, dispatch, StateContext };
};

const useStateContext = (): StateContextContainer =>
  React.useContext(StateContextObj().StateContext);
const StateProvider: React.FC<ContextProps> = ({ children }) => {
  const { state, dispatch } = useStateContext();
  const { StateContext } = StateContextObj();

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
};

export { useStateContext, StateProvider };
