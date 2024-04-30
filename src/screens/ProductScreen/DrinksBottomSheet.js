import {ScrollView, View} from 'react-native';
import BottomSheetModalComponent from '../../components/BottomSheetModal/BottomSheetModalComponent';
import BottomSheetHeader from '../../components/BottomSheetHeader/BottomSheetHeader';
import styles from './styles';
import {strings} from '../../constants';
import React, {useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import RButton from '../../components/RButton';
import {getMScale} from '../../theme/metrics';
import OptionItem from './OptionItem';

export const DrinksBottomSheet = ({option, parentModifier, drinkBottomSheetRef, onDone}) => {
  //   const drinkBottomSheetRef = useRef(null);
  const {top} = useSafeAreaInsets();
  const [selectedOption, setSelectedOption] = useState();
  const modifier = option?.modifiers?.[0];

  const closeDrinkBottomSheet = () => {
    drinkBottomSheetRef.current?.close();
    setSelectedOption(null);
  };

  return (
    <BottomSheetModalComponent
      hideHandleBar
      ref={drinkBottomSheetRef}
      topInset={top}
      onSheetDismiss={closeDrinkBottomSheet}
      snapPoints={['100%']}
      snapIndex={0}>
      <View style={styles.bottomSheetContentContainer}>
        <BottomSheetHeader
          title={modifier?.description || 'Choose'}
          titleStyle={{width: '70%', textAlign: 'center'}}
          onClose={closeDrinkBottomSheet}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.proteinsScrollContentContainer}>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              rowGap: 15,
              columnGap: getMScale(8),
              marginStart: getMScale(15),
            }}
            key={String(modifier?.id)}>
            {modifier?.options?.map((childOption, optionIndex) => (
              <OptionItem
                isSelected={selectedOption?.id === childOption.id}
                isProtein
                option={childOption}
                modifier
                optionIndex
                onSelectOption={() => {
                  setSelectedOption({...childOption, optionIndex});
                }}
              />
            )) ?? <></>}
          </View>
        </ScrollView>
          <View style={styles.buttonContainerStyle}>
          <RButton
            accessibilityHint={
              !selectedOption ? 'select an item to add' : 'make a selection to activate this button'
            }
            title={strings.done}
            onPress={() => {
              onDone({option, modifier: parentModifier, optionIndex: option.optionIndex});
              onDone({option:selectedOption, modifier, optionIndex: selectedOption.optionIndex});
              closeDrinkBottomSheet();
            }}
            buttonStyle={styles.buttonStyle}
            // titleStyle={styles.addCartTitle}
            disabled={!selectedOption}
            // loading={addingToBag}
          />
        </View>
      </View>
    </BottomSheetModalComponent>
  );
};
