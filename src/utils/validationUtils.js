import isEmail from 'validator/es/lib/isEmail';

export const isValidEmail = str => {
  return isEmail(str?.trim());
};

export const isValidPassword = str => {
  return str?.length >= 8;
};
