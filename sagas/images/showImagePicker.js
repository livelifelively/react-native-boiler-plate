import { call, put } from 'redux-saga/effects';
import { images } from '../../services';

export default function* showImagePicker(action) {
  try {
    const response = yield call(images.showImagePicker);

    if (__DEV__) {
      console.log('showImagePicker', response);
    }

    if (action.meta.nextAction) {
      yield put({
        ...action.meta.nextAction,
        payload: response,
      });
    }
  } catch (error) {
    const payload = error instanceof Error ? error : new Error(error);

    yield put({
      type: 'SET_SYSTEM_MESSAGE',
      payload,
      error: true,
    });
  }
}
