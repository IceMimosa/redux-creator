import configureStore from 'redux-mock-store';
import * as Redux from 'redux';
import promiseMiddleware from 'redux-promise';

import * as ReduxCreator from '../src';
import HelloCreator from './creators/hello';
import PromiseCreator from './creators/promise';

// connect all creators
const connector = ReduxCreator.connect(HelloCreator, PromiseCreator);
// store init
const middlewares = [ ReduxCreator.fetchStatusMiddleware, promiseMiddleware ];
const store = Redux.createStore(
  Redux.combineReducers(connector.getReducers()),
  Redux.applyMiddleware(...middlewares)
);

it('hello world', () => {
  const data = 'Redux Creator';
  // Dispatch the action
  store.dispatch(HelloCreator.hello(data))
  expect(store.getState().hello).toBe(`Hello ${data}`);
})

it('test promise', (done) => {
  const id = 1;
  // Dispatch the action
  store.dispatch(PromiseCreator.promise(id))
    .then(it => { 
      expect(store.getState().promise).toBe(`Promise ${id}`);
      done();
    });
})

it('test promise status', (done) => {
  const id = 1;
  // Dispatch the action
  store.dispatch(PromiseCreator.promiseStatus(id))
    .then(it => { 
      const state = store.getState();
      // 内容校验
      expect(state.promise).toBe(`Promise Status ${id}`);
      // 结束后的 fetch 状态
      const fetchStatus = ReduxCreator.getFetchStatus(state, PromiseCreator.promiseStatus);
      expect(fetchStatus).toBe(false);
      done();
    });
  // 获取一开始的状态
  const state = store.getState();
  const fetchStatus = ReduxCreator.getFetchStatus(state, PromiseCreator.promiseStatus)
  expect(fetchStatus).toBe(true);
})