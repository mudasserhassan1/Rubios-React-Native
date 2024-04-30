import React, {useMemo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {colors} from '../../theme';
import RText from '../../components/RText';
import styles from './styles';
import {getScale} from '../../theme/metrics';
import useUserSelector from '../../hooks/reduxStateHooks/useUserSelector';

const InfoComponent = ({
  Image,
  titleText,
  subTitle,
  btnText,
  onPress,
  containerStyle,
  titleFontSize,
  titleWeight,
  subTitleSize,
  hideExtraUI,
  orderType,
    ...rest
}) => {
  const {isAccessibilityOn = false} = useUserSelector();

  const accessibilityHint = useMemo(() => {
    if (btnText === 'Change') {
      return `activate to change ${orderType} address`
    }
    if (btnText === 'Schedule') {
      return 'activate to open time slots modal'
    }
    return '';
  }, [btnText, orderType])

  const accessibilityLabel = useMemo(() => {
    return `${titleText}`
  }, [titleText])

  return (
    <TouchableOpacity
      accessible
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{text: subTitle}}
      activeOpacity={1}
      onPress={isAccessibilityOn ?  onPress: null}
      {...rest}>
      <View style={[styles.container, containerStyle]}>
        {Image ? (
          <View style={{width: '15%'}}>
            <Image />
          </View>
        ) : null}
        <View
          style={{width: !Image ? '80%' : hideExtraUI ? '85%' : '65%', marginStart: 5}}>
          <RText
            text={titleText}
            weight={titleWeight}
            size={titleFontSize}
            color={colors.primary}
            textStyle={styles.titleText}>
            {' '}
          </RText>
          {subTitle ? (
            <RText
              text={subTitle}
              color={colors.primary}
              size={subTitleSize}
              numberOfLines={1}
              ellipsizeMode={'tail'}
              textStyle={[
                styles.subTitleText,
                {width: !Image ? '85%' : hideExtraUI ? getScale(250) : getScale(185)},
              ]}
            />
          ) : null}
        </View>
        {hideExtraUI ? null : (
          <>
            <View style={styles.line} />
            <TouchableOpacity
              accessibilityElementsHidden={true}
              hitSlop={{top: 20, bottom: 20, left: 10, right: 10}}
              style={{width: '22%'}}
              onPress={onPress}>
              <RText
                text={btnText}
                size={'xxs'}
                weight={'semiBold'}
                allowFontScaling={false}
                color={colors.primaryLink}
                textStyle={styles.rightText}/>
            </TouchableOpacity>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default InfoComponent;
