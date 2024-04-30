import React, {useState} from 'react';
import {SafeAreaView, View, StyleSheet, TextInput} from 'react-native';
import RText from '../../components/RText';
import {strings} from '../../constants';
import useProviderSelector from '../../hooks/reduxStateHooks/useProviderSelector';
import {colors} from '../../theme';
import RButton from '../../components/RButton';
import {useDispatch} from 'react-redux';
import {submitFeedBack} from '../../redux/actions/order';
import {isIos} from "../../utils/sharedUtils";

const OrderFeedBackScreen = ({route}) => {
  const {user} = useProviderSelector();
  const dispatch = useDispatch();

  const [feedBack, setFeedBack] = useState('');

  const {email: userEmail = '', first_name = '', last_name = ''} = user || {};

  const onSubmitClick = () => {
    const obj = {
      target: 'food',
      category: 'compliment',
      email: userEmail,
      fullname: first_name + ' ' + last_name,
      feedback: feedBack,
      orderid: route?.params?.orderId,
      vendorid: route?.params?.vendorid,
    };
    dispatch(submitFeedBack(obj));
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.textWrapper}>
        <RText
          text={strings.please_provide_your_feedback_for_this_order}
          textStyle={styles.inviteTextStyle}
        />
        <TextInput
          style={styles.input}
          value={feedBack}
          onChangeText={setFeedBack}
          multiline={true}
          allowFontScaling={isIos}
          maxFontSizeMultiplier={1.3}
          underlineColorAndroid="transparent"
        />
        <RButton onPress={onSubmitClick} title={strings.submit} disabled={!feedBack.trim()} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    marginTop: 30,
    borderColor: 'gray',
    backgroundColor: colors.grey,
    height: 150,
    paddingTop: 15,
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
  },
  copiedText: {
    marginTop: 10,
    color: 'red',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  textWrapper: {
    padding: 20,
  },
  inviteTextStyle: {
    fontSize: 18,
    paddingTop: 20,
  },
  referralCodeStyle: {
    fontWeight: 'bold',
    fontSize: 18,
    paddingTop: 20,
  },
});

export default OrderFeedBackScreen;
