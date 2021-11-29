import { createStore } from 'redux';

function reducer(state: any, action: { type: any, accountAddress: any }):any {
  if (action.type) {
    state = action.accountAddress;
    return state;
  }
  return state;
}
const store = createStore(reducer, {});
export default store;
