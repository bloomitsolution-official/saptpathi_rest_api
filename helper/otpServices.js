import axios from "axios";
export const generateOTP = (length) => {
  const string = "123456789";
  let OTP = "888000";
  const len = string.length;
  for (let i = 0; i < length; i++) {
    OTP += string[Math.floor(Math.random() * len)];
  }
  return OTP;
};

export const sendOtp = async (phone, message) => {
  try {
    const response = await axios.get("https://www.fast2sms.com/dev/bulkV2", {
      params: {
        authorization: process.env.FAST2SMS_API_KEY,
        message: message,
        route: "q",
        numbers: phone,
      },
      headers: {
        "cache-control": "no-cache",
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
