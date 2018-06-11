import configureStore from 'redux-mock-store';
import * as Redux from 'redux';
import promiseMiddleware from 'redux-promise';

import * as ReduxCreator from '../src';
import HelloCreator from './creators/hello';
import PromiseCreator from './creators/promise';

// connect all creators
const connector = ReduxCreator.connect(HelloCreator, PromiseCreator);
// store init
const middlewares = [ promiseMiddleware ];
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