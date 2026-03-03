import axiosInstance from "../api/axios";

/**
 * Đăng ký user mới
 * @param {Object} userData
 * @param {string} userData.email
 * @param {string} userData.username
 * @param {string} userData.password
 * @param {string} userData.fullName
 * @returns {Promise<Object>} Response với user info và token
 */
export const register = async (userData) => {
  try {
    const response = await axiosInstance.post("/api/auth/register", userData);
    const { token, user } = response.data.data;

    // Lưu token vào localStorage
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }

    return response.data;
  } catch (error) {
    console.error("Error registering:", error);
    throw error;
  }
};

/**
 * Đăng nhập
 * @param {Object} credentials
 * @param {string} credentials.emailOrUsername
 * @param {string} credentials.password
 * @returns {Promise<Object>} Response với user info và token
 */
export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post("/api/auth/login", credentials);
    const { token, user } = response.data.data;

    // Lưu token vào localStorage
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }

    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

/**
 * Đăng xuất
 */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

/**
 * Lấy thông tin user hiện tại
 * @returns {Promise<Object>} User info
 */
export const getCurrentUser = async () => {
  try {
    const response = await axiosInstance.get("/api/auth/me");
    return response.data;
  } catch (error) {
    console.error("Error getting current user:", error);
    throw error;
  }
};

/**
 * Kiểm tra xem user đã đăng nhập chưa
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

/**
 * Lấy token từ localStorage
 * @returns {string|null}
 */
export const getToken = () => {
  return localStorage.getItem("token");
};

/**
 * Lấy user info từ localStorage
 * @returns {Object|null}
 */
export const getUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};
