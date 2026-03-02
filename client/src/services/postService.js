import axiosInstance from "../api/axios";

/**
 * Lấy tất cả posts (có pagination)
 * @param {number} limit - Số lượng posts mỗi trang (default: 20)
 * @param {number} offset - Vị trí bắt đầu (default: 0)
 * @returns {Promise<Array>} Danh sách posts
 */
export const getAllPosts = async (limit = 20, offset = 0) => {
  try {
    const response = await axiosInstance.get("/posts", {
      params: { limit, offset },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

/**
 * Lấy thông tin 1 post theo ID
 * @param {string} postId - ID của post
 * @returns {Promise<Object>} Thông tin post
 */
export const getPostById = async (postId) => {
  try {
    const response = await axiosInstance.get(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
};

/**
 * Lấy tất cả posts của 1 user
 * @param {string} userId - ID của user
 * @returns {Promise<Array>} Danh sách posts của user
 */
export const getPostsByUserId = async (userId) => {
  try {
    const response = await axiosInstance.get(`/posts/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    throw error;
  }
};

/**
 * Tạo post mới (yêu cầu authentication)
 * @param {Object} postData - Dữ liệu post
 * @param {string} postData.content - Nội dung post
 * @param {string} postData.privacy - public | friends | private (default: public)
 * @param {Array<string>} postData.imageUrls - Mảng URLs của hình ảnh
 * @returns {Promise<Object>} Post vừa tạo
 */
export const createPost = async (postData) => {
  try {
    const response = await axiosInstance.post("/posts", postData);
    return response.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

/**
 * Cập nhật post (yêu cầu authentication và là tác giả)
 * @param {string} postId - ID của post cần update
 * @param {Object} postData - Dữ liệu cần update
 * @param {string} postData.content - Nội dung post
 * @param {string} postData.privacy - public | friends | private
 * @param {Array<string>} postData.imageUrls - Mảng URLs của hình ảnh
 * @returns {Promise<Object>} Post đã update
 */
export const updatePost = async (postId, postData) => {
  try {
    const response = await axiosInstance.put(`/posts/${postId}`, postData);
    return response.data;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

/**
 * Xóa post (yêu cầu authentication và là tác giả)
 * @param {string} postId - ID của post cần xóa
 * @returns {Promise<void>}
 */
export const deletePost = async (postId) => {
  try {
    await axiosInstance.delete(`/posts/${postId}`);
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};
