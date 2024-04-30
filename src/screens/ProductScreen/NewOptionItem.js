import { useSelector } from 'react-redux';
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { images } from '../../assets';
import {
  AccessibilityInfo,
  findNodeHandle,
  Platform,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './styles';
import ImageComponent from '../../components/ImageComponent/ImageComponent';
import { colors } from '../../theme';
import RText from '../../components/RText';
import SelectedIcon from '../../assets/svgs/SelectedIcon';
import SwipeableListItem from './SlideView';
import VerticalDotsMenuIcon from '../../assets/svgs/VerticalDotsMenuIcon';
import { getCaloriesCostString } from '../../utils/productUtils';
import HorizontalLine from './HorizontalLine';
import { checkTacoMatch } from '../../helpers/common';
import { isIos } from '../../utils/sharedUtils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NewOptionItem = ({
  isSelected,
  isProtein,
  option,
  modifier,
  optionIndex,
  onSelectOption,
  innerModifiers,
  popupModifiers,
  isLastOption,
  isNewDesign,
  showDrinksModal,
}) => {
  const { top } = useSafeAreaInsets();
  const [isExpanded, setIsExpanded] = useState(false);
  // const [hasRemoveable, setHasRemoveable] = useState(innerModifiers.options.);

  const {
    id: optionId,
    name,
    cost,
    chainoptionid,
    basecalories,
    maxcalories,
    isdefault,
  } = option || {};
  const { isQuantityStepper, maxSelects } = modifier || {};
  const { quantity } = isSelected || {};
  const { options, id: innerModifierId } = innerModifiers?.[0] || {};

  const itemImage = useSelector(state => state.modifiersImages?.[chainoptionid]);
  const popupItemImages = useSelector(state => popupModifiers?.[0]?.options?.map( opt => state.modifiersImages?.[opt.chainoptionid]));
  const selections = useSelector(state => state.productSelections);

  const isMaxOptionsSelected =
    isQuantityStepper && maxSelects === (selections[modifier.id]?.selected?.length || 0);
  const isOptionDisabled = isMaxOptionsSelected && !isSelected;

  const swipeItemRef = useRef(null);
  const verticalIconRef = useRef(null);
  const optionInfoRef = useRef(null);
  const firstInnerModifierRef = useRef(null);

  const selectedInnerModifier = useMemo(() => {
    return options?.[selections?.[innerModifierId]?.selected?.[0]?.optionIndex];
  }, [innerModifierId, options, selections]);

  const {
    name: selectedModifierName,
    cost: selectedModifierCost,
    id: selectedModifierId,
  } = selectedInnerModifier || {};

  const itemImageUri = useMemo(() => {
    if (['no rice', 'no beans', 'no protein', 'no salsa'].includes(name.toLowerCase())) {
      return images.no_ingredients;
    }
    if (name.toLowerCase() === 'as is' || name.toLowerCase() === 'customize') {
      return { uri: global.modifierImage };
    }
    if (checkTacoMatch(name, isdefault)) {
      return { uri: global.modifierImage };
    }

    return { uri: itemImage };
  }, [isdefault, itemImage, name]);

  const caloriesCostString = useMemo(
    () => getCaloriesCostString({ basecalories, cost, maxcalories }),
    [basecalories, cost, maxcalories],
  );

  const onSelectParent = () => {
    if (popupModifiers?.length) {
      if (isSelected) {
        onSelectOption({ option, optionIndex, modifier });
      } else {
        option.parentModifierId = modifier.id;
        option.optionIndex = optionIndex;
        option.modifier = modifier;
        showDrinksModal({ option, parentModifier: modifier });
        // onSelectOption({option, optionIndex, modifier});
      }
    } else {
      if (innerModifiers?.length && global?.animateFirstSelection) {
        swipeItemRef?.current?.animate();
        global.animateFirstSelection = false;
      }
      if (
        innerModifiers[0]?.options?.find(
          opt => opt.metadata?.[0]?.key === 'IsRemoveable' && opt.metadata?.[0]?.value === 'true',
        )
      ) {
        handleSwipeRight();
      }
      // else {
      //   if (option.metadata?.[0]?.key === 'navigation-style' && option.metadata?.[0]?.value === 'popup') {
      //     onOpenBottomSheet({option, optionIndex, modifier})
      //   }
      else {
        onSelectOption({ option, optionIndex, modifier });
      }
      // }
    }
  };

  const hasRemoveAbleOption = innerModifiers => {
    const removableItemId = innerModifiers[0]?.options?.find(
      opt => opt.metadata?.[0]?.key === 'IsRemoveable' && opt.metadata?.[0]?.value === 'true',
    )?.id;
    if (removableItemId && selectedModifierId === removableItemId) {
      return false;
    } else {
      return true;
    }
  };

  const onPressInnerItem = ({ item, index }) => {
    onSelectOption({ option: item, modifier: innerModifiers?.[0], optionIndex: index });
    if (!isSelected) {
      onSelectParent();
    }
    swipeItemRef?.current?.close();
  };

  const getName = () => {
    let popupModifier = popupModifiers?.[0];
    if (isSelected && popupModifier) {
      return `${name}: ${selections[popupModifier.id].selected.map(o => o.name).join(',')}`;
    }
    return name;
  };

  const getImages = () => {
    if(isSelected && popupModifiers)
    {
      return {uri:popupItemImages[selections[popupModifiers[0].id].selected[0].optionIndex]}
    }
    return itemImageUri;
  };

  const getInnerCost = ({ name, cost }) => {
    return `${name}${cost > 0 ? ` ${name.length > 10 ? ' $ ' : '\n$'} ` + cost.toFixed(2) : ''}`;
  };

  const handleSwipeRight = () => {
    swipeItemRef.current?.openLeft();
  };

  useEffect(() => {
    if (isExpanded) {
      const reactTag = findNodeHandle(firstInnerModifierRef?.current);
      if (reactTag) {
        AccessibilityInfo?.setAccessibilityFocus(reactTag);
      }
    }
  }, [isExpanded]);
  const renderLeftDots = () => {
    return innerModifiers?.length ? (
      <Pressable
        accessible={false}
        ref={verticalIconRef}
        hitSlop={15}
        style={styles.leftDots}
        onPress={handleSwipeRight}>
        <VerticalDotsMenuIcon />
      </Pressable>
    ) : (
      <View style={styles.leftDots} />
    );
  };
  const renderSelectedInnerOption = () => {
    if (!!innerModifiers?.length && isSelected && !isExpanded) {
      const selectDefault = selections?.[innerModifierId];
      const defaultChoosenDrink = innerModifiers[0].options[0].name;
      if (selectedModifierName) {
        return (
          <View style={styles.selectedModifierParent}>
            <View style={styles.selectionInner}>
              <RText textStyle={{ textAlign: 'right' }}>
                <RText
                  text={selectedModifierName}
                  weight={selectedModifierCost > 0 ? 'semiBold' : 'regular'}
                  size={'xxs'}
                />
                {selectedModifierCost > 0 ? (
                  <RText size={'xxs'} text={`\n$ ${selectedModifierCost.toFixed(2)}`} />
                ) : null}
              </RText>
            </View>
          </View>
        );
      }
      return (
        <TouchableOpacity onPress={handleSwipeRight} style={styles.selectedModifierParent}>
          <View style={styles.selectionInner}>
            <RText textStyle={{ textAlign: 'right' }}>
              <RText text={!selectDefault ? defaultChoosenDrink : ''} size={'xxs'} />
            </RText>
          </View>
        </TouchableOpacity>
      );
    }
  };

  const renderQuantityInfo = () => {
    if (isQuantityStepper && isSelected) {
      return <RText textStyle={styles.modifierItemTitle} size={'xs'} text={`Qty ${quantity}`} />;
    }
  };

  const renderOption = () => {
    return (
      <>
        <View
          style={[
            styles.modifierImageView,
            isSelected && hasRemoveAbleOption(innerModifiers) && styles.selectedOption,
          ]}>
          {isSelected && hasRemoveAbleOption(innerModifiers) ? (
            <View style={styles.selectImage}>
              <SelectedIcon />
            </View>
          ) : null}
          <ImageComponent
            style={styles.modifierImage}
            resizeMode={'contain'}
            source={getImages()}
          />
        </View>
        {!isExpanded ? (
          <View
            accessibilityLabel={getName()}
            style={[styles.itemMeta, innerModifiers?.length && { width: '45%' }]}>
            <RText
              text={getName()}
              numberOfLines={2}
              size={isNewDesign ? 'xxs' : 'xs'}
              weight={isSelected ? 'semiBold' : 'regular'}
              textStyle={styles.modifierItemTitle}
            />
            {renderQuantityInfo()}
            {caloriesCostString ? (
              <RText
                textStyle={styles.modifierItemTitle}
                size={'xxs'}
                color={'#878787'}
                text={caloriesCostString}
              />
            ) : null}
          </View>
        ) : null}
      </>
    );
  };

  const renderLeftActions = ({ }) => {
    return (
      <View style={styles.modifiersParentView}>
        <ScrollView
          style={{ alignSelf: 'center' }}
          contentContainerStyle={{ alignItems: 'center' }}
          bounces={false}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {isExpanded &&
            options?.map((item, index) => {
              const isInnerSelected = item.id === selectedInnerModifier?.id && isSelected;
              return (
                <TouchableOpacity
                  ref={index === 0 ? firstInnerModifierRef : null}
                  accessible={true}
                  accessibilityLabel={getInnerCost(item)}
                  accessibilityState={isIos ? { selected: !!isInnerSelected } : {}}
                  accessibilityRole={'menuitem'}
                  accessibilityHint={!isInnerSelected ? 'activate to select this option' : ''}
                  accessibilityElementsHidden={!isExpanded}
                  key={String(index)}
                  activeOpacity={0.7}
                  onPress={() => onPressInnerItem({ item, index })}
                  style={[
                    styles.swipeableItem,
                    {
                      backgroundColor: isInnerSelected
                        ? colors.secondary
                        : isNewDesign
                          ? colors.white
                          : colors.grey3,
                    },
                  ]}>
                  <RText
                    accessible={false}
                    text={getInnerCost(item)}
                    size={'xxs'}
                    numberOfLines={3}
                    weight={isInnerSelected ? 'semiBold' : 'regular'}
                    color={isInnerSelected ? colors.white : colors.black}
                    textStyle={styles.swipeableText}
                  />
                </TouchableOpacity>
              );
            })}
        </ScrollView>
      </View>
    );
  };

  const isDropDownItem = useMemo(() => {
    return !!innerModifiers?.length && !isOptionDisabled;
  }, [innerModifiers?.length, isOptionDisabled]);

  const ItemContainer = useMemo(
    () => (isDropDownItem ? SwipeableListItem : View),
    [isDropDownItem],
  );

  if (isProtein) {
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={name}
        accessibilityHint={!isSelected ? 'not selected, activate to select this item' : ''}
        accessibilityValue={{ text: `$ ${cost}` }}
        accessibilityState={isIos ? { selected: !!isSelected } : {}}
        onPress={onSelectParent}
        style={styles.proteinItem}>
        <View style={[styles.modifierImageView, isSelected && styles.selectedOption]}>
          {isSelected ? (
            <View style={styles.selectImage}>
              <SelectedIcon />
            </View>
          ) : null}
          <ImageComponent source={itemImageUri} style={styles.modifierImage} />
        </View>
        <RText text={name} size={'xxs'} weight={'semiBold'} textStyle={styles.proteinItemText} />
        <RText
          accessibilityElementsHidden={true}
          text={cost > 0 ? `$ ${cost}` : ''}
          size={'xxs'}
          textStyle={styles.proteinItemCost}
        />
      </TouchableOpacity>
    );
  }

  const accessibilityActions = useMemo(() => {
    let actions = [];
    if (innerModifiers?.length > 0) {
      actions = innerModifiers[0]?.options?.map(item => ({ name: item.name, label: item.name }));
    }
    return Platform.select({
      ios: actions,
      android: [],
    });
  }, [innerModifiers]);

  const handleAccessibilityAction = event => {
    const name = event?.nativeEvent?.actionName;
    const { options = [] } = innerModifiers?.[0];
    const index = options.map(item => item.name).indexOf(name);
    const item = innerModifiers[0]?.options[index] ?? {};
    onPressInnerItem({ item, index });
  };

  const accessibilityValue = useMemo(() => {
    let valueString = '';
    if (isSelected) {
      if (innerModifiers?.length > 0) {
        valueString = valueString + selectedModifierName;
      }
      if (selectedModifierCost > 0) {
        valueString = valueString + `, $ ${selectedModifierCost}`;
      }
    }
    if (caloriesCostString?.length > 0) {
      valueString = valueString + `, ${caloriesCostString}`;
    }
    return valueString;
  }, [isSelected, caloriesCostString, selectedModifierCost, selectedModifierName]);

  const accessibilityHint = useMemo(() => {
    let hint = '';
    if (!isSelected) {
      hint = hint + 'activate to select this item,';
    }
    if (innerModifiers.length > 0) {
      hint = hint + 'swipe up or down for more options';
    }
    return hint;
  }, [isSelected, innerModifiers]);


  return (
    <>
      <Fragment key={optionId}>
        <ItemContainer
          ref={swipeItemRef}
          containerStyle={isNewDesign && { backgroundColor: 'transparent' }}
          style={!isNewDesign && { backgroundColor: 'transparent' }}
          onSwipeOpen={() => setIsExpanded(true)}
          onSwipeClose={() => setIsExpanded(false)}
          renderLeftActions={renderLeftActions}>
          <TouchableOpacity
            accessible
            disabled={isOptionDisabled}
            accessibilityActions={accessibilityActions}
            onAccessibilityAction={handleAccessibilityAction}
            accessibilityState={isIos ? { disabled: isOptionDisabled, selected: !!isSelected } : {}}
            accessibilityValue={{ text: accessibilityValue }}
            accessibilityHint={accessibilityHint}
            accessibilityLabel={getName()}
            activeOpacity={0.9}
            onPress={onSelectParent}
            style={[
              !isNewDesign ? styles.newDesignInnerView : styles.modifierInnerView,
              !!isOptionDisabled && { opacity: 0.5 },
            ]}>
            {renderLeftDots()}
            <View
              accessible={false}
              accessibilityHint={
                !innerModifiers?.length && !isSelected ? 'activate to select this item' : ''
              }
              ref={optionInfoRef}
              accessibilityValue={{ text: `${caloriesCostString}` }}
              style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
              {renderOption()}
              {renderSelectedInnerOption()}
            </View>
          </TouchableOpacity>
        </ItemContainer>
        {isLastOption ? <HorizontalLine /> : null}
      </Fragment>
    </>
  );
};

export default React.memo(NewOptionItem);
