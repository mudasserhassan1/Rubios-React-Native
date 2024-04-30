import {StyleSheet} from 'react-native';
import {colors} from '../../theme';
import {getMScale} from '../../theme/metrics';
const styles = StyleSheet.create({
  root: {
    width: '100%',
    borderRadius: 10,
    elevation: 4,
    padding: 12,
    backgroundColor: colors.palette.secondary300,
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17,
    maxWidth: '70%',
    textTransform: 'capitalize',
  },
  viewTiming: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17,
  },
  todayTiming: {
    color: colors.white,
    fontWeight: '500',
    fontSize: 15,
  },

  todayText: {
    width: '30%',
    color: colors.primary,
    fontWeight: '500',
    fontSize: 12,
  },

  timingText: {
    width: '70%',
    textAlign: 'right',
    color: colors.primary,
    fontWeight: '500',
    fontSize: 12,
  },

  rowModal: {
    flexDirection: 'row',
    marginBottom: 15,
    borderBottomWidth: 0.5,
    borderColor: colors.lightGray,
  },

  todayTimingModal: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 15,
  },
  todayHoursContainer: {
    alignItems: 'center',
    marginTop: 3,
    flexDirection: 'row',
  },
  todayHoursTitle: {
    marginEnd: 5,
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 15,
  },
  icon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },

  modal: {
    elevation: 3,
    borderRadius: 10,
    backgroundColor: colors.white,
    padding: getMScale(15),
    justifyContent: 'center',
  },

  modalButton2: {
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderColor: colors.primary,
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },

  modalOK: {
    alignSelf: 'flex-end',
  },
});

export default styles;
