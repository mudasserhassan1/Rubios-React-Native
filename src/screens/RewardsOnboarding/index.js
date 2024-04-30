import React, {useEffect, useRef, useState} from 'react';
import {View, Dimensions, TouchableOpacity, FlatList, ImageBackground} from 'react-native';
import RText from '../../components/RText';
import {colors} from '../../theme';
import PaginationDot from '../../components/PaginationDot';
import {useDispatch} from 'react-redux';
import {setIsRewardsOnBoarded} from '../../redux/actions/newUser';
import {constants, screens, strings} from '../../constants';
import styles from './styles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getMScale, SCREEN_WIDTH} from '../../theme/metrics';
import {useNavigation} from '@react-navigation/native';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';
import {images} from '../../assets';
import RButton from '../../components/RButton';
import RewardOnboardingItem from '../../components/RewardsOnBoarding';
import {logToConsole} from '../../configs';

const RewardsOnboardingScreen = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const {width} = Dimensions.get('window');
  const dispatch = useDispatch();
  const navigation = useNavigation();
  //Refs
  let flatListRef = useRef(null);

  const {REWARDS_ON_BOARDING_DATA = []} = constants || {};
  const {top} = useSafeAreaInsets();

  const handleSkip = () => {
    dispatch(setIsRewardsOnBoarded(true));
    navigation?.replace(screens.REWARDS, {comingFrom: 'RewardsOnBoarding'});
  };

  const onGoToRewardsPress = () => {
    logFirebaseCustomEvent(strings.click, {
      click_label: 'go_to_rewards',
      click_destination: screens.REWARDS,
    });
    handleSkip();
  };
  useEffect(() => {
    logFirebaseCustomEvent(strings.screen_name_filter, {
      screen_name: 'rewards_onboarding_screen',
    });
  }, []);

  const renderPaginationDots = () => {
    return (
      <View style={[styles.paginationContainer, {top: top + getMScale(10)}]}>
        <View style={{height: 34}} />
        <View style={styles.paginationDotContainer}>
          <PaginationDot
            size={10}
            curPage={currentPage}
            maxPage={REWARDS_ON_BOARDING_DATA.length}
            containerStyle={styles.dotContainerStyle}
            activeColor={colors.primary}
            inActiveColor={colors.primary}
            inActiveOpacity={0.2}
          />
        </View>
        {currentPage === 2 ? (
          <View style={{width: getMScale(40)}} />
        ) : (
          <TouchableOpacity
            accessibilityHint={'activate to go to Rewards screen.'}
            // style={{width: 30}}
            onPress={handleSkip}
            accessible
            accessibilityRole="button">
            <RText
              text={'Skip'}
              color={colors.primary}
              weight={'medium'}
              textStyle={styles.skipButton}
              size={'xs'}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderItem = ({item, index}) => {
    return <RewardOnboardingItem item={item} index={index} />;
  };

  const handleScroll = event => {
    const {contentOffset} = event.nativeEvent;
    const index = Math.round(contentOffset.x / SCREEN_WIDTH);
    setCurrentPage(index);
  };

  return (
    <ImageBackground source={images.rewardsBg} resizeMode="cover" style={styles.container}>
      {renderPaginationDots()}
      <FlatList
        ref={flatListRef}
        data={REWARDS_ON_BOARDING_DATA}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        onMomentumScrollEnd={event => {
          const {contentOffset} = event.nativeEvent;
          const currentIndex = Math.round(contentOffset.x / width);
          setCurrentPage(currentIndex);
        }}
      />
      <RButton
        accessibilityHint={'activate to go to Rewards screen.'}
        onPress={onGoToRewardsPress}
        title={strings.go_to_rewards}
        disabled={false}
        buttonStyle={styles.rewardsBtn}
      />
    </ImageBackground>
  );
};
export default RewardsOnboardingScreen;
