import {modalSheetType as Type} from '../../types/modalSheetStatus';

export function homeSideMenuBarSheetStatus(data: any) {
  return {
    type: Type.HOME_SIDE_BAR_MENU_SHEET,
    payload: data,
  };
}
export function USEASQRCODESheetStatus(data: any) {
  return {
    type: Type.USER_AS_QR_CODE_SHEET,
    payload: data,
  };
}

