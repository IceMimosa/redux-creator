import { fetchCreator } from '../lib/creator';

/**
 * 获取fetch(ajax)等请求的前后状态的中间件
 */
export const fetchStatusMiddleware = ({ dispatch }) => next => action => {
  // if action is using fetch
  if (action.meta && action.meta.fetch) {
    // fetch start: 第一次进入, 此时 action.payload 是 promise 对象
    if (!action.meta['@@__FETCH_BACK__']) {
      dispatch(fetchCreator.START({ type: action.type }))
      return next({
        ...action,
        meta: {
          ...action.meta,
          '@@__FETCH_BACK__': true,
        },
      });
    }
    // fetch end: 此时进入时, action.payload 已经是处理 promise 后的对象
    else {
      dispatch(fetchCreator.END({ type: action.type }))
    }
  }
  return next(action);
}

/**
 * 获取fetch的前后状态
 */
export const getFetchStatus = (state, actionCreator) => {
  const type = actionCreator.type;
  const status = state['@@__FETCH_STATUS'][type];
  return !!status;
};