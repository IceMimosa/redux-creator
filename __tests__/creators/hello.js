import * as ReduxCreator from '../../src';

export default ReduxCreator.create({
  namespace: 'hello',
  actions: {
    hello: ReduxCreator.createAction((data) => { 
      return `Hello ${data}`;
    })
  },
  reducers: {
    hello: ReduxCreator.createReducer((on, actions) => {
      on(actions.hello).completed((state, action) => {
        return action.payload;
      })
    }, '')
  }
});
