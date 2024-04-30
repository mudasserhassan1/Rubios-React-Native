import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import {useDispatch} from 'react-redux';
import {getChallengeDetail} from '../../redux/actions/challenges';

const Challenges = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getChallengeDetail());
  }, []);

  return <SafeAreaView style={{flex: 1}} />;
};

export default Challenges;
