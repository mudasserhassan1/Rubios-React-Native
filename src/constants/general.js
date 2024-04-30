import {strings} from './strings';
import {images} from '../assets';
import {getVerticalScale} from '../theme/metrics';

export const PASSWORD_REGEX =  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
export const phoneRegex = /^(1\s?)?((\([0-9]{3}\))|[0-9]{3})[\s\-]?[0-9]{3}[\s\-]?[0-9]{4}$/;

export const INPUT_KEYS = {
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
  EMAIL: 'email',
  PHONE: 'phone',
  VERIFICATION_CODE: 'code',
  PASSWORD: 'password',
  CONFIRM_PASSWORD: 'confirmPassword',
  BIRTHDAY: 'birthday',
  INVITE_CODE: 'inviteCode',
  LOCATIONS: 'location',
};

export const constants = {
  INPUTS: [
    {
      key: INPUT_KEYS.FIRST_NAME,
      placeHolder: strings.enter_first_name,
      maxLength: 30,
      blurOnSubmit: false,
      returnKeyType: 'next',
      label: strings.first_name,
      textContentType: 'givenName',
    },
    {
      key: INPUT_KEYS.LAST_NAME,
      placeHolder: strings.enter_last_name,
      maxLength: 30,
      blurOnSubmit: false,
      returnKeyType: 'next',
      label: strings.last_name,
      textContentType: 'familyName',
    },
    {
      key: INPUT_KEYS.PHONE,
      isMasked: true,
      placeHolder: strings.phone_number,
      maxLength: 14,
      mask: ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
      keyboardType: 'number-pad',
      returnKeyType: 'done',
      blurOnSubmit: false,
      label: strings.mobile_number,
      textContentType: 'telephoneNumber',
    },
    {
      key: INPUT_KEYS.EMAIL,
      placeHolder: strings.enter_email,
      maxLength: 30,
      autoCapitalize: false,
      keyboardType: 'email-address',
      blurOnSubmit: false,
      returnKeyType: 'next',
      label: strings.email,
      textContentType: 'emailAddress',
    },
    {
      key: INPUT_KEYS.VERIFICATION_CODE,
      placeHolder: strings.enter_verification_code,
      maxLength: 30,
      autoCapitalize: false,
      keyboardType: 'number-pad',
      blurOnSubmit: false,
      returnKeyType: 'done',
      label: strings.verification_code,
      textContentType: 'oneTimeCode',
      autoComplete: 'one-time-code',
    },
  ],
  PASSWORD_INPUTS: [
    {
      key: INPUT_KEYS.PASSWORD,
      placeHolder: strings.enter_password,
      maxLength: 16,
      editable: true,
      blurOnSubmit: false,
      returnKeyType: 'next',
      label: strings.password,
      info: strings.reset_password_info,
    },
    {
      key: INPUT_KEYS.CONFIRM_PASSWORD,
      placeHolder: strings.enter_password,
      maxLength: 16,
      editable: true,
      blurOnSubmit: false,
      returnKeyType: 'next',
      label: strings.confirm_password,
    },
  ],
  INVITE_CODE_INPUTS: [
    {
      key: INPUT_KEYS.INVITE_CODE,
      placeHolder: strings.invite_code,
      // maxLength: 30,
      editable: true,
      blurOnSubmit: false,
      returnKeyType: 'done',
    },
    {
      key: INPUT_KEYS.BIRTHDAY,
      placeHolder: strings.birthday,
      isBirthdayField: true,
      editable: false,
      pointerEvents: 'none',
    },
  ],
  GLEAP_KEY: 'oKxqMN6H3Kg2pDBInYNJydrxNTSeoAr4',
  IOS_HEADER_HEIGHT: getVerticalScale(144),
  ANDROID_HEADER_HEIGHT: getVerticalScale(150),
  SCREEN_PRESETS: {
    SCROLL: 'scroll',
    FIXED: 'fixed',
  },
  RADIUS: {
    radius: 40,
  },
  KEYBOARD_TYPES: {
    DEFAULT: 'default',
    NUMBER_PAD: 'number-pad',
    DECIMAL_PAD: 'decimal-pad',
    NUMERIC: 'numeric',
    EMAIL_ADDRESS: 'email-address',
    PHONE_PAD: 'phone-pad',
    URL: 'url',
  },
  ACCOUNT_TITLES: {
    MY_REWARDS: 'MY REWARDS',
    CHECK_IN: 'CHECK IN',
    ORDERS: 'ORDERS',
    PAYMENT_METHODS: 'PAYMENT METHODS',
    DELIVERY_ADDRESSES: 'DELIVERY ADDRESSES',
    ACCOUNT_HISTORY: 'ACCOUNT HISTORY',
    INVITE_FRIENDS: 'INVITE FRIENDS',
    CHALLENGES: 'CHALLENGES',
    CHALLENGE_DETAIL: 'Challenge Details',
    PROFILE: 'PROFILE',
    LOGOUT: 'LOGOUT',
    DELETE_ACCOUNT: 'Delete Account',
  },
  TIME_FORMAT: {
    YMD_HYPHEN: 'MM/DD',
    DMY_SLASH: 'DD/MM/yyyy',
    MDY_SLASH: 'MM/DD/yyyy',
    YMD_WITHOUTSLASH: 'yyyyMMDD',
    YYYYMMDD_HH_mm: 'YYYYMMDD HH:mm',
    h_mm_A: 'hh:mm A',
    YMD: 'YYYYMMDD',
    ddddMMMD: 'dddd MMM D',
    ddddMMMDo: 'dddd MMM Do',
    ddddmmmd: 'ddd MMM DD',
    ddddhmmA: 'dddd h:mm A',
    DM_SLASH: 'DD/MM',
    hour_mm_A: 'h:mm A',
    DMY_SLASH_: 'MM/DD/YY',
    monthNameDate_Year: 'MMMM DD, YYYY',
  },
  handOffMode: {
    PICKUP: 'pickup',
    DELIVERY: 'delivery',
    CURBSIDE: 'curbside',
    DRIVETHRU: 'drivethru',
    DISPATCH: 'dispatch',
    DINEIN: 'dinein',
  },
  deeplinkAction: {
    RESET_PASSWORD: 'resetPassword',
    MENU: 'menu',
  },
  TOAST_TYPES: {
    SUCCESS: 'SUCCESS',
  },
  addressDialogMode: {
    ADD_ADDRESS: 'addAddress',
    EDIT_ADDRESS: 'editAddress',
    CURRENT_LOCATION: 'currentLocation',
  },
  AUTH_VALIDATION_ERRORS: {
    password: {
      required: strings.password_required,
      invalid: strings.password_invalid,
    },
    email: {
      required: strings.email_required,
      invalid: strings.email_invalid,
    },
    confirmPassword: {
      required: strings.confirm_password_required,
      invalid: strings.confirm_password_invalid,
    },
    firstName: {
      required: strings.first_name_required,
    },
    lastName: {
      required: strings.last_name_required,
    },
    location: {
      required: strings.fav_loc_required,
    },
    phone: {
      required: '',
      invalid: strings.phone_invalid,
    },
    termsConditions: {
      required: strings.term_required,
    },
    general: {
      required: strings.general_msg,
    },
  },
  ALERT_TYPE: {
    OK: strings.ok,
    CANCEL: strings.cancel,
  },
  MASKS: {
    PHONE_MASK: ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
    BAR_CODE_MASK: [
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
    ],
    DIGITS_MASK: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
  },
  UPSELLS_TYPES: {
    SALSA: 'SALSA',
    DESSERT: 'DESSERT',
    SIDE: 'SIDE',
    DRINK: 'DRINK',
  },
  ON_BOARDING_DATA: [
    {
      image: images.onBoarding1,
      title: 'BAJA-INSPIRED FLAVORS',
      text: 'Tacos, burritos & bowls, customized the way you want it.',
    },
    {
      image: images.onBoarding2,
      title: 'ORDER YOUR FAVORITES',
      text: 'Save time when you reorder your recent and most-loved items.',
    },
    {
      image: images.onBoarding3,
      title: 'FIND DELICIOUS NEAR YOU',
      text: 'Your nearest location is only a click away.',
      withButton: true,
      buttons: [{title: 'Share Location', key: 'location'}],
    },
    {
      image: images.onBoarding4,
      title: 'EAT AND CELEBRATE',
      text: 'Be the first to find out about new products, deals & personalized offers.',
      withButton: true,
      buttons: [{title: 'Allow Notifications', key: 'notification'}],
    },
  ],

  REWARDS_ON_BOARDING_DATA: [
    {
      image: '',
      title: 'More Perks To Earn,\n' + 'More Rubio’s to Love',
      text: 'The best way to save on all your favorites.',
    },
    {
      image: images.rewardsBg1,
      title: 'How to Earn',
      text: 'Every delicious bite will earn you points. Just order in the app, online, or scan your in-app QR code to earn 10 points for every $1 spent. ',
    },
    {
      image: images.rewardsBg2,
      title: 'How to REDEEM ',
      text: 'Savings are a click away. Use your rewards, relax, and enjoy a Taste of Baja!',
    },
  ],

  LastOnBoardingButtons: [
    {title: 'Sign up', key: 'signup'},
    {title: 'Log in', key: 'login'},
  ],

  MY_ORDERS_DUMMY_DATA: [
    {
      image: images.onBoarding3,
      title: 'Baja Chimichurri Two Taco Plate with Red Argentinian Shrimp',
      price: '12.99',
      quantity: 1,
      key: 'one',
    },
    {
      image: images.onBoarding4,
      title: 'Baja Chimichurri Two Taco Plates',
      price: '12.99',
      quantity: 1,
      key: 'two',
    },
  ],
};
