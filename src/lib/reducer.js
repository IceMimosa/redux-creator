import { handleActions } from 'redux-actions';
import * as Utils from './utils';

/**
 * 创建reducer方法
 */
export const createReducer = (actionHandle, initialState = {}) => {
  const reducer = new Reducer();
  reducer.actionHandle = actionHandle;
  reducer.initialState = initialState;
  return reducer;
}

/**
 * Reducer对象
 */
class Reducer {
  constructor() {
    this.actionHandle = (data) => data;
    this.initialState = {};
  }
  getReducerCreator(currentActions, reducerType) {
    const onHandlers = [];
    // 1. on方法, 传入actionCreator
    function on(actionCreator) {
      actionCreator = Utils.getOrThrow(actionCreator, `Missing action for reducer(${reducerType})`)
      const onHandler = new OnHandler(actionCreator);
      onHandlers.push(onHandler);
      return onHandler;
    }
    if (this.actionHandle != undefined && typeof this.actionHandle === 'function') {
      this.actionHandle(on, currentActions);
    }
    // 2. 构造 handleActions 需要的 handlers
    const handlers = {};
    onHandlers.forEach(onHandler => {
      handlers[onHandler.actionType] = {
        // redux-actions 中 handleAction 的 next 方法
        next(state, action) {
          const result = onHandler.completedHandler(state, action);
          return result != null ? result : state;
        },
        // redux-actions 中 handleAction 的 throw 方法
        throw(state, action) {
          const result = onHandler.failedHandler(state, action);
          return result != null ? result : state;
        }
      };
    });
    return handleActions(handlers, this.initialState);
  }
}

/**
 * OnHandler对象, 处理成功和失败的方法
 */
class OnHandler {
  constructor(actionCreator) {
    this.actionType = actionCreator.type;
    this.completedHandler = (state, action) => action.payload;
    this.failedHandler = state => state;
  }
  completed(handler) {
    this.completedHandler = handler;
    return this;
  }
  failed(handler) {
    this.failedHandler = handler;
    return this;
  }
}
