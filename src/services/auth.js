import axiosInstance from "./axios";

export const loginUser = async (payload) => {
  try {
    const response = await axiosInstance.post("users/login", payload);

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "An error occurred");
  }
};

export const registerUser = async (payload, isInviteId = false) => {
  try {
    const url = isInviteId ? `users/create?isDocSignupThroughEmail=true` : "users/create";
    const response = await axiosInstance.post(url, payload);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Registration failed");
  }
};

export const verifyOtp = async (payload) => {
  try {
    const response = await axiosInstance.post("users/verify-user", payload);

    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "OTP verification failed"
    );
  }
};

export const resendOtp = async (payload) => {
  try {
    const response = await axiosInstance.post("users/resend-otp", payload);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Resend OTP failed");
  }
};

export const updatePassword = async (payload) => {
  try {
    const response = await axiosInstance.put("users/update-password", payload);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Password updated failed");
  }
};

export const getInvitedUserInfo = async (id) => {
  try {
    const response = await axiosInstance.get(`invite/doctor/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || "archiving case failed");
  }
};
