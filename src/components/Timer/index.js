import React, {useImperativeHandle} from 'react';
import {useEffect, useState, forwardRef} from 'react';
import RText from '../RText';
import {colors} from '../../theme';

const Timer = forwardRef(({countDown = 20, onComplete, containerStyle}, ref) => {
  const [timer, setTimer] = useState(countDown);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    } else {
      onComplete(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleRestart = () => {
    setTimer(20);
  };

  useImperativeHandle(ref, () => ({
    handleRestart,
  }));
  const getTime = () => String(timer < 10 ? '0:0' + timer : '0:' + timer);

  return <RText text={getTime()} color={colors.primaryLink} size={'xs'} weight={'medium'} textStyle={containerStyle} />;
});

export default Timer;
