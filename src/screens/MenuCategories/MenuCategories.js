import {StatusBar, TouchableOpacity, View} from 'react-native';
import {colors} from '../../theme';
import Categories from './Categories';
import {screens} from '../../constants';
import React, {useEffect, useRef, useState} from 'react';
import {getMScale,SCREEN_WIDTH} from '../../theme/metrics';
import {isIos} from '../../utils/sharedUtils';
import OrderTypeAndLocationInfo from '../../components/OrderTypeAndLocationInfoComponent/OrderTypeAndLocationInfo';
import {navigateTo} from '../../utils/navigationUtils';
import RText from '../../components/RText';
import ScreenHeader from '../../components/ScreenHeader/ScreenHeader';
import useBasketSelector from '../../hooks/reduxStateHooks/useBasketSelector';
import {Animated} from 'react-native';
import TabIndicator from '../../components/TabIndicator';
import useUserSelector from "../../hooks/reduxStateHooks/useUserSelector";
import Favourites from "./FavouriteOrders";
import RecentOrders from "./RecentOrders";
import BottomSheetModalComponent from "../../components/BottomSheetModal/BottomSheetModalComponent";
import AddToFavBottomSheet from "../MyOrders/AddToFavBottomSheet";
import MyFavIcon70 from "../../assets/svgs/MyFavIcon70";
import useRecentOrdersHook from "../MyOrders/useRecentOrdersHook";

const MenuCategories = () => {

  const {cartCount} = useBasketSelector();
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalTabWidth, setTotalTabWidth] = useState(0);

    const props = useRecentOrdersHook();
    const {recentOrders, favOrder, onFavClick, snapPoints, isGuest, bottomSheetRef} = props ?? {};

  const {isAccessibilityOn} = useUserSelector();

  useEffect(() => {
      if (!isAccessibilityOn) {
          setActiveIndex(0)
      }
  }, [isAccessibilityOn])

  const menuTabs = [
    {
      id: '1',
      title: 'All',
      key: 'all',
      Page: Categories,
    },
    {
      id: '2',
      title: 'Recent Orders',
      key: 'recentOrders',
      Page: RecentOrders,
    },
    {
      id: '3',
      title: 'Favorites',
      key: 'fav',
      Page: Favourites,
    },
  ];
  const onTabPress = index => {
      if (isAccessibilityOn) {
          setActiveIndex(index);
      } else {
          flatListRef.current?.scrollToIndex({index, animated: true});
      }
  };

  const handleScroll = event => {
    const {contentOffset} = event.nativeEvent;
    const index = Math.round(contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  const renderTabs = () => {
    return (
      <Animated.View
          accessibilityRole={'tablist'}
        onLayout={event => setTotalTabWidth(event?.nativeEvent?.layout?.width)}
        style={{
          width: '93%',
          height: 30,
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'center',
          justifyContent: 'space-between',
          borderBottomWidth: 2,
          borderBottomColor: colors.primary_23,
        }}>
        {menuTabs.map((item, index) => {
          const isSelected = index === activeIndex;
          return (
            <TouchableOpacity
                accessible
                accessibilityRole={'tab'}
                accessibilityState={isIos ? {selected: isSelected}: {}}
                accessibilityLabel={item.title}
                accessibilityHint={!isSelected ? `activate to open ${item?.title} tab`: ''}
                key={String(item.id)}
                onPress={() => onTabPress(index)}
                style={{
                    width: totalTabWidth / 3,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                  <RText
                    text={item?.title}
                    color={isSelected ? colors.secondary : colors.subTitleText}
                    weight={isSelected ? 'semiBold' : 'regular'}
                    size={'xxs'}
                  />
            </TouchableOpacity>
          );
        })}
        <TabIndicator
          activeTab={activeIndex}
          totalTabs={menuTabs.length}
          tabWidth={totalTabWidth / 3}
          containerStyle={{bottom: -2}}
        />
      </Animated.View>
    );
  };

  const handleAuthNavigator = screen => {
    setTimeout(() => {
      navigateTo('AuthStack', {
        screen: screen,
        params: {screenName: screens.MENU_CATEGORIES},
      });
    }, 300);
  };

  const renderViewBasedOnAccessibility = () => {
      if (!isAccessibilityOn) {
         return (
             <Animated.FlatList
            ref={flatListRef}
            data={menuTabs}
            bounces={false}
            accessibilityRole={'tablist'}
            extraData={activeIndex}
            removeClippedSubviews={false}
            scrollEnabled={true}
            keyExtractor={(item, index) => String(item.key || index)}
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            keyboardShouldPersistTaps={'handled'}
            disableIntervalMomentum={true}
            snapToInterval={SCREEN_WIDTH}
            scrollEventThrottle={1}
            onScroll={handleScroll}
            horizontal
            contentContainerStyle={{
              paddingTop: 10,
            }}
            decelerationRate={0.0}
            // onMomentumScrollEnd={handleScroll}
            renderItem={({item, index}) => {
             const {Page} = item || {};
             if (index === 1) {
                 return <Page {...props}/>
             }
            return <Page/>;
            }}
          />
         )
      } else {
          if (activeIndex === 0) {
              return <Categories/>
          }
          if (activeIndex === 1) {
              return  <RecentOrders {...props}/>
          }
          return <Favourites/>
      }
  }

    const renderBottomSheet = () => {
        return (
            <BottomSheetModalComponent
                ref={bottomSheetRef}
                onSheetDismiss={() => StatusBar.setBarStyle('dark-content')}
                snapPoints={snapPoints}
                renerBackrop={true}>
                <AddToFavBottomSheet
                    bottomSheetRef={bottomSheetRef}
                    TitleImage={() => <MyFavIcon70 />}
                    title={'Give your favorite order a name!'}
                    closeBottomSheet={() => bottomSheetRef?.current?.closeSheet()}
                    favOrderId={favOrder?.id}
                />
            </BottomSheetModalComponent>
        );
    };

  return (
    <>
      <ScreenHeader showCartButton={true} title={'Menu'} />
      <View
        style={{
          backgroundColor: colors.white,
          flex: 1,
          width: SCREEN_WIDTH,
        }}>
        <OrderTypeAndLocationInfo
          containerStyle={{
            marginBottom: getMScale(10),
            marginTop: getMScale(isIos ? 10 : 30),
            width: '94%',
            alignSelf: 'center',
          }}
        />
          {renderTabs()}
          {renderViewBasedOnAccessibility()}
      </View>
        {renderBottomSheet()}
    </>
  );
};

export default MenuCategories;
