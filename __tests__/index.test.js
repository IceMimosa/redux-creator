import configureStore from 'redux-mock-store';
import * as Redux from 'redux';
import * as ReduxCreator from '../src';

const creator = ReduxCreator.create({
  namespace: 'TODO',
  actions: {
    add: ReduxCreator.createAction(() => { 
      return { result: 'add_payload' };
     })
  },
  reducers: {
    add: ReduxCreator.createReducer((on, actions) => {
      on(actions.add).completed((state, action) => {
        return action.payload;
      })
    }, {})
  }
});
const connector = ReduxCreator.connect(creator);

const middlewares = []
const store = Redux.createStore(
  Redux.combineReducers(connector.getReducers()),
  Redux.applyMiddleware(...middlewares)
)

/**
 * HelloWorld
 */
it('hello world', () => {
  // Dispatch the action
  store.dispatch(creator.add())
  console.log(store.getState().add);
})