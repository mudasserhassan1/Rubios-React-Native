import {ActivityIndicator, SafeAreaView, View} from 'react-native';
import React from 'react';
import {styles} from '../styles';
import useRecentOrdersHook from './useRecentOrdersHook';
import RText from '../../../components/RText';
import {constants, strings} from '../../../constants';
import {colors} from '../../../theme';
import {FlashList} from '@shopify/flash-list';
import {formatDateTime} from '../../../utils/timeUtils';

const RecentOrdersTab = () => {
  const {orders, userDataLoading} = useRecentOrdersHook();
  const listEmptyComponent = () => {
    return (
      <View style={styles.emptyComponentWrapper}>
        <RText
          text={strings.no_recent_orders}
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
          text={formatDateTime(
            item?.item?.timeplaced,
            constants.TIME_FORMAT.MDY_SLASH,
            constants.TIME_FORMAT.YYYYMMDD_HH_mm,
          )}
          textStyle={styles.dateTextStyle}
        />
        <RText text={item?.item.oloid} textStyle={styles.textStyle} />
        <RText
          text={'$' + item?.item.total}
          textStyle={styles.amountTextStyle}
          numberOfLines={1}
          ellipsizeMode={'tail'}
        />
      </View>
    );
  };

  const renderContent = () => {
    if (userDataLoading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator color={colors.primary} size={'large'} />
        </View>
      );
    }
    return (
      <>
        {orders && (
          <View style={styles.pointsWrapper}>
            <RText text={strings.date} textStyle={styles.headingTextStyle} />
            <RText
              text={strings.order_id}
              textStyle={styles.headingTextStyle}
            />
            <RText text={strings.amount} textStyle={styles.headingTextStyle} />
          </View>
        )}

        <FlashList
          data={orders}
          renderItem={ItemView}
          ListEmptyComponent={listEmptyComponent}
          ItemSeparatorComponent={ItemSeparatorView}
          // contentContainerStyle={{flex: 1, justifyContent: 'center'}}
          estimatedItemSize={200}
          keyExtractor={(item, index) => index.toString()}
        />
      </>
    );
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>{renderContent()}</View>
    </SafeAreaView>
  );
};

export default RecentOrdersTab;
