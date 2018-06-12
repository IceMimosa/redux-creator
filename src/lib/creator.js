import * as Utils from './utils';
import { createActionType, createAction } from './action';
import { createReducer } from './reducer';

const EMPTY_CREATORS = { actions: [], reducers: [] };

const NAMESPACE_KEY = 'namespace';
const ACTION_KEY = 'actions';
const REDUCER_KEY = 'reducers';
const MIDDLE_AWARE = 'middlewares';

/**
 * create方法
 */
export const create = (func) => {
  let obj = func || EMPTY_CREATORS;
  if (typeof func === 'function') {
    obj = func.apply(this) || obj;
  }
  // 1. get creator values
  const namespace = Utils.getOrThrow(obj[NAMESPACE_KEY], `Missing value for ${NAMESPACE_KEY}`);
  const actions = obj[ACTION_KEY] || {};
  const reducers = obj[REDUCER_KEY] || {};
  // const middlewares obj[MIDDLE_AWARE] || {};

  // 2. handle actions
  const ns = createActionType(namespace);
  const actionObj = {};
  for (const actionType in actions) {
    const action = actions[actionType];
    if (action === undefined) {
      continue;
    }
    const actionCreator = action.getActionCreator(ns(actionType));
    // 这里不合并ns
    actionObj[actionType] = actionCreator;
  }

  // 3. handle reducers
  const reducerObj = {};
  for (const reducerType in reducers) {
    const reducer = reducers[reducerType];
    if (reducer === undefined) {
      continue;
    }
    const reducerCreator = reducer.getReducerCreator(actionObj, reducerType);
    reducerObj[reducerType] = reducerCreator;
  }

  return {
    '@@__NAMESPACE__': namespace,
    '@@__REDUCERS__': reducerObj,
    '@@__ACTIONS__': actionObj,
    ...actionObj
  }
}

/**
 * 连接所有的creators
 */
export const connect = (...creators) => {
  // 加入内部的creator
  creators.push(fetchCreator);

  // connect 所有的 creator
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

/**
 * 内部定义的fetch creator
 */
export const fetchCreator = create({
  namespace: '@@__FETCH__',
  actions: {
    'START': createAction(),
    'END': createAction()
  },
  reducers: {
    '@@__FETCH_STATUS': createReducer((on, actions) => {
      on(actions.START).completed((state, action) => {
        const { type } = action.payload;
        return Object.assign({}, state, { [type]: true });
      })
      on(actions.END).completed((state, action) => {
        const { type } = action.payload;
        delete state[type];
        return state;
      })
    }, {})
  }
})