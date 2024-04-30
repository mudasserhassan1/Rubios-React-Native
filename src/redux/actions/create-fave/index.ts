import {displayToast} from '../../../helpers/toast';
import {createFaveTypes as Type} from '../../types/create-fave';

export function createFave(body: RequestNewFave, callBack: any) {
  return {
    type: Type.CREATE_FAVE,
    payload: body,
    callBack,
  };
}

export function createFaveSuccess() {
  displayToast('SUCCESS', 'Order saved as favorite');
  return {
    type: Type.CREATE_FAVE_SUCCESS,
  };
}

export function createFaveFailure(error: any) {
  displayToast(
    'ERROR',
    error?.response?.data?.message ? error?.response?.data?.message : 'Error',
  );
  return {
    type: Type.CREATE_FAVE_FAILURE,
    error: error,
  };
}
