import { handleActions } from "redux-actions";

/**
 * 创建reducer方法, 具体使用参考文档
 */
export const createReducer = (func, initialState) => {
  const onHandlers = [];
  // 1. on方法, 传入action
  function on(actionCreator) {
    const onHandler = new OnHandler(actionCreator);
    onHandlers.push(onHandler);
    return onHandler;
  }
  if (func != undefined && typeof func === "function") {
    func(on);
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
  return handleActions(handlers, initialState);
};

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
