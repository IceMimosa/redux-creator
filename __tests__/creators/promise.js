import * as ReduxCreator from '../../src';

// delay方法
const delay = (time) => (result) => new Promise(resolve => setTimeout(() => resolve(result), time));

export default ReduxCreator.create({
  namespace: 'TestPromise',
  actions: {
    promise: ReduxCreator.createAction((id) => { 
      return Promise.resolve({ body: `Promise ${id}` }).then(delay(2000)).then(res => res.body)
    }),
    promiseStatus: ReduxCreator.createAction((id) => { 
      return Promise.resolve({ body: `Promise Status ${id}` }).then(delay(2000)).then(res => res.body)
    }, { fetch: true })
  },
  reducers: {
    promise: ReduxCreator.createReducer((on, actions) => {
      on(actions.promise).completed((state, action) => {
        return action.payload;
      });
      on(actions.promiseStatus).completed((state, action) => {
        return action.payload;
      });
    }, {})
  }
});
