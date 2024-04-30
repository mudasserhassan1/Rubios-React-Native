import RText from '../../components/RText';
import React, {useEffect} from 'react';
import styles from './styles';
import {useDispatch, useSelector} from 'react-redux';
import {
  getRedeemableRedemptionCode,
  getRewardRedemptionCode,
} from '../../redux/actions/reward/redemption';
import {ImageBackground, SafeAreaView, ScrollView, TouchableOpacity, View} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {colors} from '../../theme';
import ImageComponent from '../../components/ImageComponent/ImageComponent';
import {images} from '../../assets';
import {getMScale} from '../../theme/metrics';
import QRPlaceholder from './QRPlaceholder';
import moment from 'moment/moment';

const RewardQrcode = ({navigation, route}) => {
  const dispatch = useDispatch();

  const id = route?.params?.id;
  const name = route?.params?.name;
  const type = route?.params?.type;
  const reedeemAbleImage = route?.params?.image;
  const rewardImage = route?.params?.rewardImage;
  const description = route?.params?.description;
  const expiry = route?.params?.expiry;
  const {redemption, loading1, error} = useSelector(state => state.redemption);

  const callBack = status => {
    if (status === 'failure') {
      navigation.goBack();
    }
  };

  useEffect(() => {
    if (id) {
      if (type === 'reward') {
        dispatch(getRewardRedemptionCode(id, callBack));
      } else if (type === 'redeemable') {
        dispatch(getRedeemableRedemptionCode(id, callBack));
      }
    }
  }, []);

  const renderQRCodeUI = () => {
    if (
      redemption &&
      (redemption.internal_tracking_code || redemption.redemption_tracking_code) &&
      name !== ''
    ) {
      return (
        <ScrollView bounces={false}>
          <ImageBackground source={images.rewardsBg} style={styles.imageBackground}>
            <ImageComponent
              source={{uri: type === 'reward' ? rewardImage : reedeemAbleImage}}
              style={styles.topImage}
            />
          </ImageBackground>
          {loading1 ? (
            <QRPlaceholder />
          ) : (
            <View style={styles.qrParent}>
              <View style={styles.qrcodeContainer}>
                <QRCode
                  size={220}
                  value={
                    type === 'reward'
                      ? redemption?.internal_tracking_code
                      : redemption?.redemption_tracking_code
                  }
                />
                <RText
                  text={
                    redemption?.internal_tracking_code ||
                    redemption?.redemption_tracking_code
                  }
                  textStyle={styles.code}
                />
              </View>
              <RText
                text={name}
                color={colors.primary}
                size={'lg'}
                weight={'bold'}
                textStyle={{
                  textAlign: 'center',
                  marginHorizontal: getMScale(40),
                  marginTop: getMScale(30),
                }}
              />
              {expiry ? (
                <RText
                  text={'Expires: ' + moment(expiry).format('MM/DD/YYYY')}
                  color={colors.subTitleText}
                  size={'xxs'}
                  textStyle={{
                    textAlign: 'center',
                    fontStyle: 'italic',
                    marginVertical: getMScale(20),
                  }}
                />
              ) : null}

              <RText
                text={description}
                color={colors.subTitleText}
                size={'xxs'}
                textStyle={{
                  textAlign: 'center',
                  marginHorizontal: getMScale(20),
                  marginTop: getMScale(20),
                }}
              />
            </View>
          )}
        </ScrollView>
      );
    }
    return null;
  };

  const renderHeaderView = () => {
    return (
      <View style={styles.timeSlotHeader}>
        <View style={styles.nullHeaderIcon} />
        <RText
          text={'enjoy, You EARNED IT!'}
          textStyle={{textTransform: 'uppercase'}}
          size={'lg'}
          weight={'headerBold'}
        />
        <TouchableOpacity
          onPress={navigation.goBack}
          activeOpacity={0.7}
          style={styles.headerIconBackground}>
          <ImageComponent source={images.header_cross} style={styles.headerCrossIcon} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView>
      {renderHeaderView()}
      {renderQRCodeUI()}
    </SafeAreaView>
  );
};

export default RewardQrcode;
