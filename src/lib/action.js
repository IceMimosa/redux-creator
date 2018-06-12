/**
 * 创建action的命名空间, 返回一个传入actionType的函数
 * 
 * @param {String} namespace 命名空间名称
 */
export const createActionType = (namespace) => (actionType) => `${namespace}#${actionType}`


/**
 * 创建Action的方法
 * 
 * @param {Function} payloadCreator payload的创建方法
 * @param {Any} metaCreator meta的创建方法
 */
export const createAction = (payloadCreator = (data) => data, metaCreator = {}) => {
  const action = new Action();
  action.payloadCreator = payloadCreator;
  action.metaCreator = metaCreator;
  return action;
}

/**
 * Action对象
 */
class Action {
  constructor() {
    this.payloadCreator = (data) => data;
    this.metaCreator = {}; // or function
  }
  getActionCreator(actionType) {
    const actionCreator = (...args) => {
      // 获取元数据
      let meta = this.metaCreator || {};
      if (typeof this.metaCreator === 'function') {
        meta = metaCreator(...args);
      }

      return {
        type: actionType,
        payload: this.payloadCreator(...args),
        meta
      }
    }
    actionCreator.type = actionType;
    return actionCreator;
  }
}