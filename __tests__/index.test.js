import configureStore from 'redux-mock-store';
import * as Redux from 'redux';
import * as ReduxCreator from '../src';
import HelloCreator from './creators/hello';

// connect all creators
const connector = ReduxCreator.connect(HelloCreator);
// store init
const middlewares = [];
const store = Redux.createStore(
  Redux.combineReducers(connector.getReducers()),
  Redux.applyMiddleware(...middlewares)
);

/**
 * HelloWorld
 */
it('hello world', () => {
  const data = 'Redux Creator';
  // Dispatch the action
  store.dispatch(HelloCreator.hello(data))
  expect(store.getState().hello).toBe(`Hello ${data}`);
})