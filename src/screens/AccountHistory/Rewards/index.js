import {
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef} from 'react';
import {styles} from '../styles';
import useRewardsHook from './useRewardsHook';
import RText from '../../../components/RText';
import {strings} from '../../../constants';
import moment from 'moment';
import {colors} from '../../../theme';
import {FlashList} from '@shopify/flash-list';
import DescriptionModal from '../DescriptionModal/DescriptionModalJSX';

const RewadsTab = () => {
  const descRef = useRef();
  const {
    accountHistory,
    dataLoading,
    showDescriptionModal,
    openDescriptionModal,
    closeDexcriptionnModal,
  } = useRewardsHook();
  const listEmptyComponent = () => {
    return (
      <View style={styles.emptyComponentWrapper}>
        <RText
          text={strings.no_rewards}
          textStyle={styles.emptyListTextStyle}
        />
      </View>
    );
  };
  const ItemSeparatorView = () => {
    return <View style={styles.separatorStyle} />;
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
  const descriptionModal = item => {
    descRef.current = item?.item.description;
    openDescriptionModal();
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
        {accountHistory && (
          <View style={styles.pointsWrapper}>
            <RText text={strings.date} textStyle={styles.headingTextStyle} />
            <RText
              text={strings.category}
              textStyle={styles.headingTextStyle}
            />
            <RText
              text={strings.activity}
              textStyle={styles.headingTextStyle}
            />
          </View>
        )}

        <FlashList
          data={accountHistory}
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
export default RewadsTab;
