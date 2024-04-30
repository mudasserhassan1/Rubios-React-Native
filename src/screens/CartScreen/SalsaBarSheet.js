import {forwardRef, useCallback, useImperativeHandle, useMemo, useRef} from 'react';
import BottomSheetModalComponent from '../../components/BottomSheetModal/BottomSheetModalComponent';
import React from 'react';
import UpsellsModalComponent from '../../components/UpsellsModalComponent/UpsellsModalComponent';
import {constants} from '../../constants';

const SalsaBarSheet = forwardRef(({onOpen, onClose}, ref) => {
  const snapPoints = useMemo(() => [683], []);

  const bottomSheetRef = useRef();

  const open = useCallback(() => {
    bottomSheetRef.current?.openSheet?.();
  }, []);

  const close = useCallback(() => {
    bottomSheetRef?.current?.closeSheet();
  }, []);

  useImperativeHandle(ref, () => ({
    open,
    close,
  }));
  return (
    <BottomSheetModalComponent
      ref={bottomSheetRef}
      snapIndex={0}
      snapPoints={snapPoints}
      hideHandleBar={true}>
      <UpsellsModalComponent
        selectedCategory={constants.UPSELLS_TYPES.SALSA}
        title={'Add Free Salsa'}
        onClose={close}
      />
    </BottomSheetModalComponent>
  );
});
export default SalsaBarSheet;
