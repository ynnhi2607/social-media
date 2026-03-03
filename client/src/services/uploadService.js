import axiosInstance from "../api/axios";

/**
 * Upload single image
 * @param {File} file - Image file from input
 * @returns {Promise<string>} - Cloudinary URL
 */
export const uploadSingleImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await axiosInstance.post("/api/upload/single", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data.url;
};

/**
 * Upload multiple images
 * @param {File[]} files - Array of image files
 * @returns {Promise<string[]>} - Array of Cloudinary URLs
 */
export const uploadMultipleImages = async (files) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  const response = await axiosInstance.post("/api/upload/multiple", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data.map((img) => img.url);
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 */
export const deleteImage = async (publicId) => {
  await axiosInstance.delete("/api/upload/delete", {
    data: { publicId },
  });
};
