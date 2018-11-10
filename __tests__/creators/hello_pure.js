import * as ReduxCreator from '../../src';

export default ReduxCreator.create({
  namespace: 'hello',
  actions: {
    hello: (data) => { 
      return `Hello Pure ${data}`;
    }
  },
  reducers: {
    hello: (on, actions) => {
      on(actions.hello).completed((state, action) => {
        return action.payload;
      })
    }
  }
});
