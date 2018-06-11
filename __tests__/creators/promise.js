import * as ReduxCreator from '../../src';

export default ReduxCreator.create({
  namespace: 'TestPromise',
  actions: {
    promise: ReduxCreator.createAction((id) => { 
      return Promise.resolve({ body: `Promise ${id}` }).then(res => res.body)
    })
  },
  reducers: {
    promise: ReduxCreator.createReducer((on, actions) => {
      on(actions.promise).completed((state, action) => {
        return action.payload;
      })
    }, '')
  }
});
