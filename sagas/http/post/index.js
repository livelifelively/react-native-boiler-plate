import { call, put } from 'redux-saga/effects';

import { http } from '../../../services';
import utils from '../../../utils';

export default function* post(action) {
  try {
    const response = yield call(
      http.post,
      action.payload.url,
      action.payload.headers,
      action.payload.body,
    );
    const nextAction = utils.app.prepareNextAction(action, response);

    if (nextAction) {
      yield put(nextAction);
    }
  } catch (error) {
    yield put({
      type: 'SET_SYSTEM_MESSAGE',
      payload: utils.app.createError(error),
      error: true,
    });
  }
}