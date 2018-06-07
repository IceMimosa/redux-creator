import configureStore from 'redux-mock-store';
import * as Redux from 'redux';
import { createActionType, createAction, createReducer } from '../src';


const ns = createActionType('TODO')
const addTodo = createAction(ns('ADD'))

const reducer = createReducer(on => {
  on(addTodo).completed((state, action) => {
    console.log(action);
  })
}, {})

const middlewares = []
const store = Redux.createStore(
  Redux.combineReducers({ reducer }),
  Redux.applyMiddleware(...middlewares)
)

/**
 * HelloWorld
 */
it('hello world', () => {
  // Dispatch the action
  store.dispatch(addTodo())
})