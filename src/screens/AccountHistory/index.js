import {Screen} from '../../components/Screen';
import ScreenHeader from '../../components/ScreenHeader/ScreenHeader';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {SectionList, View} from 'react-native';
import styles from './styles';
import RText from '../../components/RText';
import {colors} from '../../theme';
import {getMScale, getVerticalScale, SCREEN_HEIGHT} from '../../theme/metrics';
import Placeholder from '../MyRewardScreen/Placeholder';
import useMyRewardsHook from '../MyRewardScreen/useMyRewardsHook';
import {getAccountHistory} from '../../redux/actions/account-history';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';
import {screens, strings} from '../../constants';
import EmptyOrderIcon from '../../assets/svgs/EmptyOrderIcon';
import RButton from '../../components/RButton';
import {navigateTo} from '../../utils/navigationUtils';
import useBasketSelector from '../../hooks/reduxStateHooks/useBasketSelector';
import {formatDateTime} from '../../utils/timeUtils';
import ImageComponent from '../../components/ImageComponent/ImageComponent';
import {images} from '../../assets';
import {logToConsole} from '../../configs';
import {useRoute} from '@react-navigation/native';

let objectsOnPage = [];
const AccountHistoryScreen = () => {
  const dispatch = useDispatch();
  const route = useRoute();

  const {points} = route.params || {};
  const {cartCount} = useBasketSelector();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const {accountHistory, loading: accountHistoryLoading} = useSelector(
    state => state.accountHistory,
  );

  useEffect(() => {
    dispatch(getAccountHistory('rewards'));
    logFirebaseCustomEvent(strings.screen_name_filter, {
      screen_name: 'rewards_history_screen',
    });
  }, []);

  const accountHistoryData = useMemo(() => {
    if (accountHistory) {
      const sorted = accountHistory
        .sort((a, b) => {
          //Sort on points
          if (moment(a.date).unix() === moment(b.date).unix()) {
            return a?.total_points < b?.total_points;
          }
          //If points are equal then sort on date
          return moment(a.date).unix() < moment(b.date).unix();
        })
        .reduce(function (filtered, option) {
          let parsedValue = parseInt(option?.event_value?.replace(/[^0-9]/g, ''), 10) ?? -1;
          if (parsedValue >= 0) {
            filtered.push({
              ...option,
              value: parsedValue,
            });
          }
          return filtered;
        }, []);

      let balanceArray = [];
      let updatedBalance = points;
      sorted.forEach((item, index) => {
        if (updatedBalance > 0) {
          balanceArray.push({
            ...item,
            balance: updatedBalance,
          });
        }
        if (item?.total_points > 0) {
          updatedBalance -= item.value;
        }
        if (item?.total_points < 0) {
          updatedBalance += item.value;
        }
      });
      const groupedData = balanceArray.reduce((acc, item) => {
        const date = moment(item.date).format('MMMM DD, YYYY');
        acc[date] = [...(acc[date] || []), item];
        return acc;
      }, {});
      logToConsole({groupedData, balanceArray});
      let items = Object.entries(groupedData).map(([title, data]) => {
        return {
          title,
          data,
        };
      });
      objectsOnPage = getObjectsPerPage(items, currentPage, itemsPerPage);
      return items;
    }
    return [];
  }, [accountHistory]);

  // eslint-disable-next-line no-shadow
  function getObjectsPerPage(data, page, itemsPerPage) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }
  // const totalPages = Math.ceil(accountHistoryData.length / itemsPerPage);

  const onEndReached = () => {
    logToConsole('onEndReached called');
    // if (currentPage !== totalPages) {
    const nextPage = currentPage + 1;
    objectsOnPage = [
      ...objectsOnPage,
      ...getObjectsPerPage(accountHistoryData, nextPage, itemsPerPage),
    ];
    setCurrentPage(nextPage);
    logToConsole({objectsOnPage});
    logToConsole({objectsOnPage: objectsOnPage?.length});
    // }
  };

  const renderCurrentPointsView = () => {
    return (
      <View style={styles.currentPointsWrapper}>
        <RText
          text={'Current Balance'}
          size={'sm'}
          weight={'semiBold'}
          color={colors.primary}
          textStyle={{letterSpacing: 0.15, lineHeight: 16}}
        />
        <View style={styles.greyLineStyle} />
        <RText
          text={points + ' Points'}
          size={'lg'}
          weight={'bold'}
          textStyle={{marginTop: getMScale(3), lineHeight: 35}}
        />
        <RText
          text={'Points expire 6 months after earning'}
          color={colors.greyTextColor_}
          size={'xxs'}
          textStyle={{fontStyle: 'italic', lineHeight: 18}}
        />
      </View>
    );
  };

  const renderPointsHeader = () => {
    return (
      <>
        <View style={styles.greyHorizontalLineStyle} />
        <View style={styles.rewardsPointHeaderWrapper}>
          <RText text={'Reward details'} color={colors.primary} size={'xxs'} />
          <RText text={'Points'} color={colors.primary} size={'xxs'} />
        </View>
        <View style={[styles.greyHorizontalLineStyle, {marginBottom: 0}]} />
      </>
    );
  };
  const NavigateOrderBtn = () => {
    if (cartCount > 0) {
      navigateTo(screens.CART);
    } else {
      navigateTo(screens.CHOOSE_ORDER_TYPE, {comingFromRewards: true});
    }
  };
  const ListEmptyComponent = () => {
    return (
      <View style={styles.emptyWrapper}>
        <EmptyOrderIcon />
        <RText
          text={strings.no_history_available}
          color={colors.subTitleText}
          size={'xxs'}
          textStyle={styles.emptyTextStyle}
        />

        <RButton
          onPress={NavigateOrderBtn}
          title={strings.order_now}
          disabled={false}
          buttonStyle={styles.orderNowBtn}
        />
      </View>
    );
  };
  const renderSectionHeader = ({section: {title} = {}}) => {
    return (
      <View style={{marginTop: getMScale(16)}}>
        <View style={styles.dateWrapper}>
          <ImageComponent
            style={{height: getMScale(12), width: getMScale(12)}}
            source={images.dateCircle}
          />
          <RText
            text={formatDateTime(title, 'MMMM D, YYYY', 'MMMM D, YYYY')}
            color={colors.primary}
            size={'xxs'}
            textStyle={styles.dateStyle}
          />
        </View>
        <View
          style={{
            height: 1,
            width: getMScale(110),
            backgroundColor: '#E7E7E7',
            marginStart: getMScale(20),
            marginTop: getMScale(5),
          }}
        />
      </View>
    );
  };
  const renderItem = ({item}) => {
    const {event_title, total_points, description, balance, value} = item || {};
    return (
      <View style={{marginStart: getMScale(20), marginVertical: getMScale(8)}}>
        <View style={styles.eventTitleWrapper}>
          <RText
            text={event_title}
            color={colors.primary}
            numberOfLines={2}
            weight={'semiBold'}
            size={'xs'}
            textStyle={{lineHeight: 24, letterSpacing0: 0.15}}
          />
          <RText
            text={`${value > 0 ? (total_points < 0 ? '- ' + value : '+ ' + value) : 0}`}
            // text={event_value}
            weight={'bold'}
            size={'xs'}
            textStyle={{
              lineHeight: 24,
              letterSpacing0: 0.15,
              color:
                total_points > 0 || event_title.toLowerCase() === 'item gifted'
                  ? colors.secondary
                  : colors.red,
            }}
          />
        </View>
        <RText
          text={description}
          color={colors.primary}
          size={'xxs'}
          textStyle={{
            lineHeight: 16,
            letterSpacing0: 0.15,
            marginTop: getVerticalScale(8),
            width: getMScale(250),
          }}
        />
        <View style={{marginTop: getVerticalScale(8)}}>
          <RText
            text={'Updated Balance: ' + balance}
            size={'xxs'}
            textStyle={{
              lineHeight: 16,
              letterSpacing0: 0.15,
              width: getMScale(250),
            }}
          />
        </View>
      </View>
    );
  };
  const renderAccountHistoryData = () => {
    return accountHistoryLoading ? (
      <View style={{width: '90%', alignSelf: 'center'}}>
        <Placeholder />
      </View>
    ) : (
      <View style={styles.timeLineWrapper}>
        <SectionList
          sections={objectsOnPage}
          extraData={currentPage}
          showsVerticalScrollIndicator={false}
          stickyHeaderHiddenOnScroll={true}
          stickySectionHeadersEnabled={false}
          contentContainerStyle={{paddingBottom: 400}}
          maxToRenderPerBatch={20}
          windowSize={21}
          scrollEventThrottle={400}
          initialNumToRender={20}
          onEndReachedThreshold={0.7}
          onEndReached={onEndReached}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={ListEmptyComponent}
          renderSectionHeader={renderSectionHeader}
          renderItem={renderItem}
        />
      </View>
    );
  };
  return (
    <Screen preset={'fixed'} withHeader style={{backgroundColor: colors.white}}>
      <ScreenHeader showCartButton={false} title={'REWARDS HISTORY'} />
      {renderCurrentPointsView()}
      {renderPointsHeader()}
      <View style={{height: SCREEN_HEIGHT}}>{renderAccountHistoryData()}</View>
    </Screen>
  );
};

export default AccountHistoryScreen;
