/**
 * 创建Action的方法
 * 
 * @param {String} actionType actionType
 * @param {Function} payloadCreator payload的创建方法
 * @param {Any} metaCreator meta的创建方法
 */
export const createAction = (actionType, payloadCreator = (data) => data, metaCreator) => {
  const action = (...args) => {
    const meta = getMeta(metaCreator, ...args);
    return {
      type: actionType,
      payload: payloadCreator(...args),
      meta
    }
  }
  action.type = actionType;
  return action;
}

/**
 * 获取meta信息
 */
function getMeta(metaCreator, ...args) {
  if (metaCreator === undefined || !(typeof metaCreator === 'function')) {
    return metaCreator;
  }
  return metaCreator(...args)
}

/**
 * 创建action的命名空间, 返回一个传入actionType的函数
 * 
 * @param {String} namespace 命名空间名称
 */
export const createActionType = (namespace) => (actionType) => `${namespace}#${actionType}`