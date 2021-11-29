import {createStore} from 'redux'


function reducer(state: any, action: { type: any; accountAddress: any; }):any {
  if(action.type){
    state = action.accountAddress;
    return state
  } else {
    return state
  }
}
const store = createStore(reducer,{})
export default store
