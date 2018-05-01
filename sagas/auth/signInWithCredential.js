import { call, put } from 'redux-saga/effects';
import { auth } from '../../services';

export default function* signInWithCredential(action) {
  try {
    const response = yield call(auth.signInWithCredential, action.payload.credential);

    if (__DEV__) {
      console.log('signInUserWithCredentialResponse', response);
    }

    if (action.meta.nextAction) {
      yield put({
        ...action.meta.nextAction,
        payload: response,
      });
    }
  } catch (error) {
    if (error.message.code === 'auth/account-exists-with-different-credential') {
      yield put({
        type: 'SET_SYSTEM_MESSAGE',
        payload: new Error(
          "Hello! You've already signed in with someone else. Please try another option.",
        ),
        error: true,
      });
    } else {
      const payload = error instanceof Error ? error : new Error(error);

      yield put({
        type: 'SET_SYSTEM_MESSAGE',
        payload,
        error: true,
      });
    }
  }
}
