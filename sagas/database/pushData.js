import { call, put } from 'redux-saga/effects';
import { database } from '../../services';

export default function* pushData(action) {
  try {
    const { payload } = yield call(database.pushData);

    if (__DEV__) {
      console.log('pushData', payload);
    }

    if (action.nextAction) {
      yield put({
        ...action.nextAction,
      });
    }
  } catch (error) {
    yield put({
      type: 'SET_MESSAGE',
      payload: new Error(error),
      error: true,
    });
  }
}
