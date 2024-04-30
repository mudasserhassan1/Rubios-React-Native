import {messagesTypes as Type} from '../../types/messages';
import {addToDate, isAfterDate, isBetweenTime} from '../../../utils/timeUtils';
import {logToConsole} from '../../../configs';

export function getMessages() {
  return {
    type: Type.GET_MESSAGES,
  };
}

export function getMessagesSuccess(data: any) {
  const currentDate = new Date().toISOString();
  const filteredMessages: any = data?.messages.filter((msg: any) => {
    const nextDate = addToDate(1, 'days');

    const {launch_time, take_down_time = nextDate} = msg || {};
    // if (deleted_at && isAfterDate(deleted_at, currentDate)) {
    //   return false;
    // }
    if (!launch_time && !take_down_time) {
      return true;
    }
    if (launch_time && take_down_time && isBetweenTime(currentDate, launch_time, take_down_time)) {
      return true;
    }
    if (launch_time && isAfterDate(currentDate, launch_time)) {
      return true;
    }
    if (take_down_time && isAfterDate(take_down_time, currentDate)) {
      return true;
    }
    return false;
  });
  return {
    type: Type.GET_MESSAGES_SUCCESS,
    payload: {messages: filteredMessages},
  };
}

export function getMessagesFailure(data: any) {
  return {
    type: Type.GET_MESSAGES_FAILURE,
    payload: data,
  };
}
