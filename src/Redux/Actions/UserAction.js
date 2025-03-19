import { SAVE_USER } from '../Types'
export const save_user = (data) => {
  return async dispatch => {
    dispatch({
        type: SAVE_USER,
        payload: data
    })
  }
}