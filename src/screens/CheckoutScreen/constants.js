import {strings} from '../../constants';
import {Masks} from 'react-native-mask-input';

export const INPUT_KEYS = {
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
  EMAIL: 'email',
  PHONE: 'phone',
  PASSWORD: 'password',
  CONFIRM_PASSWORD: 'confirmPassword',
  BIRTHDAY: 'birthday',
  TABLE_NUMBER: 'tableNumber',
  VEHICLE_MODEL: 'vehicleModal',
  VEHICLE_MADE: 'vehicleMake',
  VEHICLE_COLOR: 'vehicleColor',
};

export const INPUTS = [
  {key: INPUT_KEYS.FIRST_NAME, placeHolder: strings.first_name, maxLength: 30},
  {key: INPUT_KEYS.LAST_NAME, placeHolder: strings.last_name, maxLength: 30},
  {
    key: INPUT_KEYS.PHONE,
    isMasked: true,
    placeHolder: strings.phone_number,
    maxLength: 30,
    mask: Masks.USA_PHONE,
    keyboardType: 'number-pad',
    returnKeyType: 'done',
  },
  {
    key: INPUT_KEYS.EMAIL,
    placeHolder: strings.email,
    maxLength: 30,
    autoCapitalize: false,
    keyboardType: 'email-address',
  },
  {
    key: INPUT_KEYS.VEHICLE_MODEL,
    placeHolder: strings.vehicle_model,
    maxLength: 30,
    isVehicleInput: true,
  },
  {
    key: INPUT_KEYS.VEHICLE_MADE,
    placeHolder: strings.vehicle_make,
    maxLength: 30,
    isVehicleInput: true,
  },
  {
    key: INPUT_KEYS.VEHICLE_COLOR,
    placeHolder: strings.vehicle_color,
    maxLength: 30,
    isVehicleInput: true,
  },
];

export const PASSWORD_INPUTS = [
  {
    key: INPUT_KEYS.PASSWORD,
    placeHolder: strings.password,
    maxLength: 16,
    label: 'Password must be at least 8 characters',
    secureTextEntry: true,
    editable: true,
  },
  {
    key: INPUT_KEYS.CONFIRM_PASSWORD,
    placeHolder: strings.confirm_password,
    maxLength: 16,
    secureTextEntry: true,
    editable: true,
  },
  {
    key: INPUT_KEYS.BIRTHDAY,
    placeHolder: strings.birthday,
    isBirthdayField: true,
    editable: false,
    pointerEvents: 'none',
  },
];


// const placeOrder = () => {
//   const body = {
//     authtoken: '5dEGWkea40S6Ry20HgFK9TCaothtwYww',
//     usertype: 'user',
//     contactnumber: '15055555555',
//     contactnumberextension: '12345678',
//     reference: '012446dbbd8a0f674d78ebf186a9307208bf6cbecf35589d7e13a841c6a7122a',
//     // cardnumber: '4111111111111111',
//     // expiryyear: 2025,
//     // expirymonth: 3,
//     // cvv: '578',
//     billingaccounts: [
//       {
//         billingmethod: 'creditcard',
//         amount: 6.19,
//         cardnumber: '4111111111111111',
//         expiryyear: 2024,
//         expirymonth: 8,
//         cvv: '211',
//         tipportion: 0,
//         streetaddress: '26 Broadway',
//         streetaddress2: 'Apt 32',
//         city: 'New York',
//         state: 'New York',
//         zip: '10004',
//         country: 'US',
//         saveonfile: 'true',
//       },
//       {
//         billingmethod: 'creditcard',
//         amount: 6.19,
//         cardnumber: '4111234511112222',
//         expiryyear: 2024,
//         expirymonth: 8,
//         cvv: '211',
//         tipportion: 0,
//         streetaddress: '26 Broadway',
//         streetaddress2: 'Apt 32',
//         city: 'New York',
//         state: 'New York',
//         zip: '10004',
//         country: 'US',
//         saveonfile: 'true',
//       },
//       // {
//       //   billingmethod: 'storedvalue',
//       //   amount: 6.19,
//       //   billingschemeid: 338,
//       //   billingfields: [
//       //     {
//       //       name: 'number',
//       //       value: '3106 0800 1791 0032 72661',
//       //     },
//       //     {
//       //       name: 'pin',
//       //       value: '5536',
//       //     },
//       //   ],
//       // },
//     ],
//     guestoptin: true,
//   };
//   const {id} = basket || {};
//   try {
//     axios
//       .post(`/baskets/${id}/submit/multiplepayments`, body)
//       .then(response => logToConsole({response: response.data}))
//       .catch(error => {
//         console.log(error.response);
//         logToConsole({err: error.response});
//         alert(JSON.stringify(error.response));
//         throw error;
//       });
//   } catch (error) {
//     alert(error.message);
//     throw error;
//   }
// };

