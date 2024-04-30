import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {colors} from '../../theme';
import RText from '../../components/RText';
import {getMScale, getVerticalScale} from '../../theme/metrics';
import ImageComponent from '../../components/ImageComponent/ImageComponent';
import SeeMoreDropDown from '../../assets/svgs/SeeMoreDropDown';
import DeleteIcon from '../../assets/svgs/DeleteIcon';
import AddIcon from '../../assets/svgs/AddIcon';
import Collapsible from 'react-native-collapsible';
import ShowLessIcon from '../../assets/svgs/ShowLessIcon';

const MyOrderCard = ({image, title, price, quantity}) => {
  const [collapse, setCollapsed] = useState(true);

  const toggleExpanded = () => {
    setCollapsed(!collapse);
  };
  const renderGreyHorizontalLine = () => <View style={styles.greyHorizontalLineStyle} />;
  const renderCollapseableView = () => {
    return (
      <Collapsible collapsed={collapse} align="center">
        <View style={styles.collapseableView}>
          <RText
            size={'xs'}
            color={colors.black}
            weight={'regular'}
            textStyle={styles.collapseableText}
            text={'Remove: Cabbage, Cotija Cheese'}
          />
          <RText
            size={'xs'}
            weight={'regular'}
            color={colors.black}
            textStyle={styles.collapseableText}
            text={'Add: Cabbage, Cotija Cheese'}
          />
          <RText
            size={'xs'}
            color={colors.black}
            weight={'regular'}
            textStyle={styles.collapseableText}
            text={'Sides: Cabbage, Cotija Cheese'}
          />
        </View>
      </Collapsible>
    );
  };
  return (
    <View style={styles.parentStyle}>
      <View style={styles.container}>
        <ImageComponent
          resizeMode={'cover'}
          source={image}
          style={styles.imageStyle}
        />
        <View style={{marginStart: getMScale(25)}}>
          <RText
            text={title}
            weight={'semiBold'}
            size={'xs'}
            color={colors.primary}
            ellipsizeMode={'tail'}
            numberOfLines={2}
            textStyle={styles.titleText}>
            {' '}
          </RText>

          <TouchableOpacity onPress={toggleExpanded}>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
              <RText
                text={collapse ? 'See More' : 'See Less'}
                color={colors.primary}
                size={'xs'}
                ellipsizeMode={'tail'}
                numberOfLines={1}
                textStyle={styles.subTitleText}>
                {' '}
              </RText>
              <View style={styles.seeMoreStyle}>
                {collapse ? <SeeMoreDropDown /> : <ShowLessIcon />}
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {renderCollapseableView()}
      <View style={styles.quantityView}>
        <View style={styles.quantityInnerView}>
          <View style={styles.emptyView} />
          <View style={{marginStart: getMScale(25)}}>
            <DeleteIcon />
          </View>
          <View style={styles.line} />
          <RText
            text={quantity}
            weight={'semiBold'}
            size={'md'}
            color={colors.primary}
            textStyle={styles.titleText}>
            {' '}
          </RText>
          <View style={styles.line} />
          <AddIcon />
        </View>

        <RText
          text={'$ ' + price}
          weight={'semiBold'}
          size={'xs'}
          color={colors.primary}
          textStyle={styles.titleText}
        />
      </View>
      {renderGreyHorizontalLine()}
    </View>
  );
};

const styles = StyleSheet.create({
  parentStyle: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: getMScale(16),
    marginVertical: getVerticalScale(16),
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  titleText: {
    color: colors.primary,
    marginTop: getMScale(5),
    lineHeight: 18,
    letterSpacing: 0.15,
    maxWidth: getMScale(250),
  },
  textStyle: {
    fontSize: 20,
    color: colors.black,
  },
  subTitleText: {
    marginTop: getVerticalScale(8),
  },
  imageStyle: {width: 75, height: 75, borderRadius: 16},
  emptyView: {width: 75},
  line: {
    height: 12,
    width: 1,
    backgroundColor: colors.dividerLine,
    marginHorizontal: getMScale(15),
  },
  greyHorizontalLineStyle: {
    height: 1,
    backgroundColor: colors.greyLine,
    marginVertical: getVerticalScale(10),
  },
  collapseableView: {
    marginStart: getMScale(97),
  },
  collapseableText: {
    lineHeight: getVerticalScale(16),
    letterSpacing: 0.15,
  },
  seeMoreStyle: {
    marginStart: getMScale(15),
    marginTop: getVerticalScale(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityView: {
    marginTop: getVerticalScale(18),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quantityInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default MyOrderCard;
