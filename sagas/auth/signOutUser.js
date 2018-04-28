import { call, put } from 'redux-saga';
import { auth } from '../../services';

export default function* signOutUser() {
  try {
    const { payload } = yield call(auth.signOutUser);

    if (__DEV__) {
      console.log('signOutUserResponse', payload);
    }

    yield put({
      type: 'SIGN_OUT_USER',
    });
  } catch (error) {
    yield put({
      type: 'SET_MESSAGE',
      payload: new Error(error),
      error: true,
    });
  }
}
