import React, { useState, useEffect, useRef } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";
import * as postService from "../../../services/postService";
import * as uploadService from "../../../services/uploadService";

const CreatePostModal = ({ isOpen, onClose, onSuccess, editPost = null }) => {
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [imageUrls, setImageUrls] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && editPost) {
      // Load post data for editing
      setContent(editPost.content || "");
      setPrivacy(editPost.privacy || "public");
      setImageUrls(editPost.media?.map((m) => m.url) || []);
    } else if (isOpen) {
      // Reset for new post
      setContent("");
      setPrivacy("public");
      setImageUrls([]);
      setNewImageUrl("");
    }
  }, [isOpen, editPost]);

  const handleAddImage = () => {
    if (newImageUrl.trim() && imageUrls.length < 4) {
      setImageUrls([...imageUrls, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    // Check if adding these files would exceed limit
    if (imageUrls.length + files.length > 4) {
      alert(
        `You can only upload up to 4 images. Currently you have ${imageUrls.length} images.`,
      );
      return;
    }

    // Validate file types and sizes
    const validFiles = [];
    for (const file of files) {
      // Check file type
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not an image file.`);
        continue;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 5MB.`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    try {
      setUploading(true);

      // Upload files to Cloudinary
      const uploadedUrls = await uploadService.uploadMultipleImages(validFiles);

      // Add to imageUrls array
      setImageUrls((prev) => [...prev, ...uploadedUrls]);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload images. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      alert("Please write something in your post!");
      return;
    }

    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to login first to create a post!");
      console.error("No token found. User needs to login.");
      return;
    }

    try {
      setLoading(true);

      const postData = {
        content: content.trim(),
        privacy,
        imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
      };

      console.log("Creating post with data:", postData);
      console.log("Token exists:", !!token);

      if (editPost) {
        await postService.updatePost(editPost.id, postData);
      } else {
        await postService.createPost(postData);
      }

      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving post:", error);

      // Better error messages
      let errorMsg = `Failed to ${editPost ? "update" : "create"} post. `;
      if (error.code === "ECONNABORTED") {
        errorMsg += "Request timeout. Please check your connection.";
      } else if (error.response?.status === 401) {
        errorMsg += "You need to login again.";
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } else if (error.response?.status === 400) {
        errorMsg += error.response.data?.message || "Invalid request.";
      } else {
        errorMsg += "Please try again later.";
      }

      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editPost ? "Edit Post" : "Create Post"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Content */}
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground resize-none"
            rows={6}
            disabled={loading}
            autoFocus
          />
        </div>

        {/* Privacy */}
        <div>
          <label
            htmlFor="privacy"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Privacy
          </label>
          <select
            id="privacy"
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value)}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            disabled={loading}
          >
            <option value="public">🌍 Public</option>
            <option value="friends">👥 Friends</option>
            <option value="private">🔒 Private</option>
          </select>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Images (max 4)
          </label>

          {/* Display added images */}
          {imageUrls.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mb-3">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-40 object-cover rounded-lg border border-border"
                    onError={(e) => {
                      e.target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23ddd'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%23999'%3EInvalid Image%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 p-1.5 bg-error text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                  >
                    <Icon name="X" size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add new image */}
          {imageUrls.length < 4 && (
            <div className="space-y-3">
              {/* File upload button */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={loading || uploading}
                />
                <Button
                  type="button"
                  onClick={handleUploadClick}
                  variant="outline"
                  className="w-full"
                  disabled={loading || uploading}
                >
                  {uploading ? (
                    <>
                      <Icon name="Loader" size={20} className="animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Icon name="Upload" size={20} />
                      <span>Upload from Device</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-background text-muted-foreground">
                    OR
                  </span>
                </div>
              </div>

              {/* URL input */}
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddImage();
                    }
                  }}
                  placeholder="Or paste image URL"
                  className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground"
                  disabled={loading || uploading}
                />
                <Button
                  type="button"
                  onClick={handleAddImage}
                  variant="outline"
                  disabled={!newImageUrl.trim() || loading || uploading}
                >
                  <Icon name="Plus" size={20} />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
            className="flex-1"
            disabled={loading || !content.trim()}
          >
            {loading ? (
              <>
                <Icon name="Loader" size={20} className="animate-spin" />
                <span>{editPost ? "Updating..." : "Posting..."}</span>
              </>
            ) : (
              <span>{editPost ? "Update Post" : "Create Post"}</span>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreatePostModal;
