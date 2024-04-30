import {ActivityIndicator, SafeAreaView, TouchableOpacity, View} from 'react-native';
import React, {useRef} from 'react';
import {styles} from '../styles';
import RText from '../../../components/RText';
import {strings} from '../../../constants';
import usePointsHook from './usePointsHook';
import {colors} from '../../../theme';
import {FlashList} from '@shopify/flash-list';
import moment from 'moment';
import DescriptionModal from '../DescriptionModal/DescriptionModalJSX';

const PointsTab = () => {
  const descRef = useRef();
  const {
    pointHistory,
    dataLoading,
    showDescriptionModal,
    openDescriptionModal,
    closeDexcriptionnModal,
  } = usePointsHook();

  const listEmptyComponent = () => {
    return (
      <View style={styles.emptyComponentWrapper}>
        <RText text={strings.no_points} textStyle={styles.emptyListTextStyle} />
      </View>
    );
  };
  const ItemSeparatorView = () => {
    return <View style={styles.separatorStyle} />;
  };
  const descriptionModal = item => {
    descRef.current = item?.item.description;
    openDescriptionModal();
  };

  const ItemView = item => {
    return (
      <View style={styles.pointsWrapper}>
        <RText
          text={moment(item?.item.date).format('MM/DD/YYYY')}
          textStyle={styles.dateTextStyle}
        />
        <RText text={item?.item.event_title} textStyle={styles.textStyle} />
        <TouchableOpacity onPress={() => descriptionModal(item)}>
          <RText
            text={item?.item.description}
            textStyle={styles.descriptiontextStyle}
            numberOfLines={1}
            ellipsizeMode={'tail'}
          />
        </TouchableOpacity>
      </View>
    );
  };
  const renderDescriptionModal = () => {
    return (
      <DescriptionModal
        isVisible={showDescriptionModal}
        onClose={closeDexcriptionnModal}
        description={descRef.current}
      />
    );
  };
  const renderContent = () => {
    if (dataLoading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator color={colors.primary} size={'large'} />
        </View>
      );
    }
    return (
      <>
        {pointHistory && (
          <View style={styles.pointsWrapper}>
            <RText text={strings.date} textStyle={styles.headingTextStyle} />
            <RText text={strings.category} textStyle={styles.headingTextStyle} />
            <RText text={strings.activity} textStyle={styles.headingTextStyle} />
          </View>
        )}
        <FlashList
          data={pointHistory}
          renderItem={ItemView}
          ListEmptyComponent={listEmptyComponent}
          ItemSeparatorComponent={ItemSeparatorView}
          // contentContainerStyle={{flex: 1, justifyContent: 'center'}}
          estimatedItemSize={200}
          keyExtractor={(item, index) => index.toString()}
        />
        {renderDescriptionModal()}
      </>
    );
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>{renderContent()}</View>
    </SafeAreaView>
  );
};

export default PointsTab;
