import {StyleSheet} from "react-native";
import {getMScale, getScale, getVerticalScale} from "../../theme/metrics";
import {colors} from "../../theme";

const styles = StyleSheet.create({
    labelStyle: {textTransform: 'none', fontSize: getScale(13), fontWeight: 'normal'},
    barStyle: {
        height: getMScale(45),
        borderBottomColor: colors.primary_23,
        borderBottomWidth: 1,
        elevation: 0,
    },
    indicatorStyle: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.secondary,
        height: 3,
    },
    container: {
        flex: 1,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textStyle: {
        fontSize: getScale(20),
        color: colors.black,
    },
    emptyWrapper: {
        marginTop: getMScale(65),
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyTextStyle: {
        marginTop: getMScale(24),
        textAlign: 'center',
        marginHorizontal: getMScale(50),
        lineHeight: 16,
        letterSpacing: 0.15,
    },
    orderNowBtn: {width: '75%', marginTop: getVerticalScale(40)},
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
    },
    modalTopImageStyle: {
        marginTop: getMScale(20),
        backgroundColor: colors.white,
        borderRadius: 55,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleTextStyle: {
        marginTop: getMScale(24),
        textAlign: 'center',
        textTransform: 'uppercase',
        lineHeight: 24,
    },
    descriptionText: {
        marginTop: getMScale(16),
        textAlign: 'center',
        lineHeight: 22,
        letterSpacing: 0.15,
    },
    createAccountBtn: {width: '85%', marginTop: getVerticalScale(32)},
    signupText: {marginTop: getMScale(24)},
    creatAccountTextStyle: {marginLeft: getMScale(11), color: colors.secondary},
});

export default styles;
