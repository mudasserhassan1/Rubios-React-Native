import React from 'react';
import Modal from 'react-native-modal';
import {Dimensions} from 'react-native';

const deviceHeight = Dimensions.get('screen').height;
const deviceWidth = Dimensions.get('screen').width;

const ModalComponent = ({
  isVisible,
  onRequestClose,
  animationIn = 'fadeIn',
  animationOut = 'fadeOut',
  animationInTime = 400,
  animationOutTime = 500,
  propagateSwipe = true,
  modalStyles,
  isDialog = true,
  children,
  ...rest
}) => {
  return (
    <Modal
      propagateSwipe={propagateSwipe}
      isVisible={isVisible}
      avoidKeyboard={true}
      animationIn={animationIn}
      deviceHeight={deviceHeight}
      deviceWidth={deviceWidth}
      animationOut={animationOut}
      // animationOutTiming={animationOutTime}
      // animationInTiming={animationInTime}
      onBackButtonPress={onRequestClose}
      onRequestClose={onRequestClose}
      hideModalContentWhileAnimating={true}
      onSwipeComplete={onRequestClose}
      statusBarTranslucent
      style={!isDialog && {margin: 0, padding: 0, justifyContent: 'flex-end'}}
      {...rest}>
      {children}
    </Modal>
  );
};

export default ModalComponent;
