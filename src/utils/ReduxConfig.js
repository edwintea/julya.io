import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk'
import rootReducer from '../Redux/Reducers/index';
 
const configReduxStore = (initialState = {}) => {
  const middleware = compose(
    applyMiddleware(thunk)
  )
  return createStore(rootReducer, initialState, middleware)
}

export default configReduxStore