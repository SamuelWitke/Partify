export const HOST_ROUTE = "HOST_ROUTE";
export function setHost(host = '/'){
    return {
    type: HOST_ROUTE,
    payload: host 
  }
}

export const getHost = (data)=>{
  return nextHost => nextHost(type: HOST_ROUTE, payload: data)
}

const initialState = null
export default function hostReducer(state = initialState, action) {
  return action.type === HOST_ROUTE ? action.payload : state
}
