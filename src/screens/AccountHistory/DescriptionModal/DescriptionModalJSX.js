import React from 'react';
import ModalComponent from '../../../components/ModalComponent/ModalComponent';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styles} from '../styles';
import {TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RText from '../../../components/RText';

const DescriptionModal = ({isVisible, onClose, description}) => {
  const renderModalBody = () => {
    return (
      <SafeAreaView style={styles.descriptionModal}>
        <TouchableOpacity onPress={onClose}>
          <MaterialIcons name={'close'} size={30} />
        </TouchableOpacity>
        <RText textStyle={{marginTop: 10, fontWeight: 'bold'}}>
          Decription:
        </RText>
        <RText textStyle={{marginTop: 10}}>
          {description}
        </RText>
      </SafeAreaView>
    );
  };

  return (
    <ModalComponent isVisible={isVisible} onRequestClose={onClose}>
      {renderModalBody()}
    </ModalComponent>
  );
};
export default DescriptionModal;
