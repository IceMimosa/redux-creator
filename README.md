Redux Action and Reducer creator.

[![npm version](https://img.shields.io/badge/npm-v0.0.6-blue.svg)](https://www.npmjs.com/package/redux)

## 1. Install

```sh
npm install --save redux-all-creator
```

* test

```sh
$ yarn
$ yarn test
```

## 2. Usage

```js
import * as ReduxCreator from 'redux-all-creator';
```

### 2.1 Create Action and Reducer

```js
// hello.js
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

// or pure hello.js
export default ReduxCreator.create({
  namespace: 'hello',
  actions: {
    hello: (data) => { 
      return `Hello ${data}`;
    }
  },
  reducers: {
    hello: (on, actions) => {
      on(actions.hello).completed((state, action) => {
        return action.payload;
      })
    } // initialState is {}
  }
});
```

### 2.2 Connect all creators

Connect all creators and get reducers object.

```js
import * as ReduxCreator from 'redux-all-creator';
import HelloCreator from './examples/hello';

// create connector
const connector = ReduxCreator.connect(HelloCreator, ...);

// create redux store
const middlewares = [];
const store = Redux.createStore(
  Redux.combineReducers(connector.getReducers()),
  Redux.applyMiddleware(...middlewares)
);

// jest test
it('hello world', () => {
  const data = 'Redux Creator';
  store.dispatch(HelloCreator.hello(data))
  // hello is reduce key
  expect(store.getState().hello).toBe(`Hello ${data}`);
})
```

* [More Examples](https://github.com/IceMimosa/redux-creator-test) OR `__tests__ directory`.


## 3. FetchStatus Middleware

You can get status(**true** or **false**) before and after Fetch(Promise) action. You should also use [redux-promise](https://github.com/redux-utilities/redux-promise).

* import middleware

```js
import promiseMiddleware from 'redux-promise';
import * as ReduxCreator from 'redux-all-creator';

const middlewares = [ ReduxCreator.fetchStatusMiddleware, promiseMiddleware ];
```

* create action and reducer

```js
// promise.js

// delay方法
const delay = (time) => (result) => new Promise(resolve => setTimeout(() => resolve(result), time));

// !!! important: add fetch property to true
export default ReduxCreator.create({
  namespace: 'TestPromise',
  actions: {
    promiseStatus: ReduxCreator.createAction((id) => { 
      return Promise.resolve({ body: `Promise Status ${id}` }).then(delay(2000)).then(res => res.body)
    }, { fetch: true })
  },
  reducers: {
    promise: ReduxCreator.createReducer((on, actions) => {
      on(actions.promiseStatus).completed((state, action) => {
        return action.payload;
      });
    }, {})
  }
});
```

* get fetch status

```js
import PromiseCreator from './example/promise';

it('test promise status', (done) => {
  const id = 1;
  store.dispatch(PromiseCreator.promiseStatus(id))
    .then(it => { 
      const state = store.getState();
      expect(state.promise).toBe(`Promise Status ${id}`);
      // fetch end
      const fetchStatus = ReduxCreator.getFetchStatus(state, PromiseCreator.promiseStatus);
      expect(fetchStatus).toBe(false);
      done();
    });
  // fetch start
  const state = store.getState();
  const fetchStatus = ReduxCreator.getFetchStatus(state, PromiseCreator.promiseStatus)
  expect(fetchStatus).toBe(true);
})
```

## Some examples

* [IceMimosa/react-antd-example](https://github.com/IceMimosa/react-antd-example)

## Todo

* [ ] Promise data cache

