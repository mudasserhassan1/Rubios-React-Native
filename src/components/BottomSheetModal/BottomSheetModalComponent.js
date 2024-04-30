import {Keyboard, View} from 'react-native';
import {BottomSheetModal, BottomSheetModalProvider, KEYBOARD_BEHAVIOR} from '@gorhom/bottom-sheet';
import {colors} from '../../theme';
import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {useCallback, useMemo} from 'react';
import {getMScale} from '../../theme/metrics';
import styles from '../../navigations/DrawerNavigator/CustomSideBarMenu/styles';
import {logToConsole} from '../../configs';

const BottomSheetModalComponent = forwardRef(
  (
    {
      children,
      onSheetChange,
      topInset,
      onSheetDismiss,
      snapPoints,
      snapIndex = 1,
      renerBackrop = true,
      hideHandleBar,
      enableContentPanningGesture,
      enableHandlePanningGesture,
      onSheetAnimated,
      ...rest
    },
    ref,
  ) => {
    const bottomSheetRef = useRef();
    const sheetSnapPoints = useMemo(() => snapPoints || ['1%', '57%'], [snapPoints]);
    const renderBackdrop = () => {
      if (!renerBackrop) {
        return null;
      } else {
        return (
          <View
            onTouchStart={Keyboard.dismiss}
            style={styles.backdropContainer}
            activeOpacity={1}
          />
        );
      }
    };

    const handleSheetChanges = useCallback(
      index => {
        if (typeof onSheetChange === 'function') {
          onSheetChange?.(index);
        }
      },
      [onSheetChange],
    );

    const openSheet = () => {
      bottomSheetRef.current?.present();
    };

    const closeSheet = () => {
      bottomSheetRef.current?.close();
    };

    const snapToIndex = index => {
      bottomSheetRef.current?.snapToIndex(index);
    };

    const collapse = () => {
      bottomSheetRef.current?.collapse();
    };

    const expand = () => {
      bottomSheetRef.current?.expand();
    };

    const close = () => {
      bottomSheetRef?.current?.close();
    };
    useImperativeHandle(ref, () => ({
      openSheet,
      closeSheet,
      snapToIndex,
      collapse,
      expand,
      close,
    }));

    const EmptyHandleComponent = () => {
      return (
        <>
          {!hideHandleBar ? (
            <View
              style={{
                height: getMScale(5),
                width: getMScale(25),
                backgroundColor: colors.handleColor,
                justifyContent: 'center',
                alignSelf: 'center',
                borderRadius: 2.5,
                marginTop: getMScale(12),
              }}
            />
          ) : (
            <View />
          )}
        </>
      );
    };
    return (
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetRef}
          index={snapIndex}
          onDismiss={onSheetDismiss}
          onAnimate={onSheetAnimated}
          snapPoints={sheetSnapPoints}
          onChange={handleSheetChanges}
          topInset={topInset}
          backdropComponent={renderBackdrop}
          handleComponent={EmptyHandleComponent}
          enableContentPanningGesture={enableContentPanningGesture}
          enableHandlePanningGesture={enableHandlePanningGesture}
          handleIndicatorStyle={{backgroundColor: colors.handleColor}}
          keyboardBehavior={KEYBOARD_BEHAVIOR.interactive}
          keyboardBlurBehavior={'restore'}
          {...rest}
        >
          {children}
        </BottomSheetModal>
      </BottomSheetModalProvider>
    );
  },
);
export default React.memo(BottomSheetModalComponent);
