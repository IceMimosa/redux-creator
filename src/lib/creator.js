import * as Utils from './utils';
import { createActionType, createAction } from './action';
import { createReducer } from './reducer';

const NAMESPACE_KEY = 'namespace';
const ACTION_KEY = 'actions';
const REDUCER_KEY = 'reducers';
// const MIDDLE_AWARE = 'middleawares';
const EMPTY_CREATORS = { actions: [], reducers: [] };

/**
 * create方法
 */
export const create = (func) => {
  let obj = func || EMPTY_CREATORS;
  if (typeof func === 'function') {
    obj = func.apply(this) || obj;
  }
  const namespace = Utils.getOrThrow(obj[NAMESPACE_KEY], `Missing value for ${NAMESPACE_KEY}`);
  const actions = obj[ACTION_KEY] || {};
  const reducers = obj[REDUCER_KEY] || {};
  // const middleawares obj[MIDDLE_AWARE] || {};

  // handle actions
  const ns = createActionType(namespace);
  const actionObj = {};
  for (const actionType in actions) {
    const action = actions[actionType];
    if (action === undefined) {
      continue;
    }
    const actionCreator = action.getActionCreator(ns(actionType));
    actionObj[actionType] = actionCreator;
  }

  // handle reducers
  const reducerObj = {};
  for (const reducerType in reducers) {
    const reducer = reducers[reducerType];
    if (reducer === undefined) {
      continue;
    }
    const reducerCreator = reducer.getReducerCreator(actionObj);
    reducerObj[reducerType] = reducerCreator;
  }

  return {
    '@@__NAMESPACE__': namespace,
    '@@__REDUCERS__': reducerObj,
    '@@__ACTIONS__': actionObj,
    ...actionObj
  }
}

export const connect = (...creators) => {
  let reducers = {};
  let actions = {};
  for (const creator of creators) {
    const reducerObj = creator['@@__REDUCERS__'];
    if (!!reducerObj) {
      reducers = {...reducers, ...reducerObj}
    }
    const actionObj = creator['@@__ACTIONS__'];
    if (!!actionObj) {
      actions = {...actions, ...actionObj}
    }
  }

  return {
    getActions: () => actions,
    getReducers: () => reducers
  }
}