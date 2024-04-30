import axiosDbInstance from "../axiosInterceptor/axiosDbInstance";


export const sendOTP = (mobile: string) => {
  try {
    const obj = {
      phone: mobile,
    };
    return axiosDbInstance
      .post('/user/send-otp', obj)
      .then(response => response)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

export const verifyEmail = (email: string) => {
  try {
    return axiosDbInstance
      .post(`/user/verify-email/${email}`)
      .then(response => response)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

export const verifyPhoneNumber = (mobile: string) => {
  try {
    return axiosDbInstance
      .post(`/user/verify-number/${mobile}`)
      .then(response => response)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

export const verifyOTP = (mobile: string, code: string) => {
  try {
    const obj = {
      phone: mobile,
      code: code,
    };
    return axiosDbInstance
      .post('/user/verify-otp' , obj)
      .then(response => response)
      .catch(error => {
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

export const updateUseronOurDB = (mobile: string, email: string): any => {
  try {
    const obj = {
      phone: mobile,
      email: email,
      punchhId: '',
      oloId: '',
    };
    return axiosDbInstance
      .patch('/user/user', obj)
      .then(response => response)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

export const deleteUserFromDb = (mobile: string): any => {
  try {
    return axiosDbInstance
      .delete(`/user/${mobile}`)
      .then(response => response)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};
