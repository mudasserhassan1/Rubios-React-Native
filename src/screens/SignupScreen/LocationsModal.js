import React from 'react';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import ChooseStore from '../ChooseStoreScreen/ChooseStore';

const LocationsModal = ({
  isVisible,
  onClose,
  onItemClick,
  onModalShow,
  onModalHide,
  selectedOrderType,
  isLoading,
}) => {
  return (
    <ModalComponent
      isVisible={isVisible}
      isDialog={false}
      onRequestClose={onClose}
      animationIn={'slideInRight'}
      animationOut={'slideOutRight'}
      // animationInTime={400}
      animationOutTime={400}
      onModalShow={onModalShow}
      onModalHide={onModalHide}>
      <ChooseStore
        onSelectItem={onItemClick}
        onClose={onClose}
        selectedOrderType={selectedOrderType}
        isLoading={isLoading}
      />
    </ModalComponent>
  );
};

export default React.memo(LocationsModal);
