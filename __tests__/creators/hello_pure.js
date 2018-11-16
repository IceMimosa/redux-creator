import * as ReduxCreator from '../../src';

export default ReduxCreator.create({
  namespace: 'hello_pure',
  actions: {
    hello: (data) => { 
      return `Hello Pure ${data}`;
    }
  },
  reducers: {
    hello_pure: (on, actions) => {
      on(actions.hello).completed((state, action) => {
        return action.payload;
      })
    }
  }
});
