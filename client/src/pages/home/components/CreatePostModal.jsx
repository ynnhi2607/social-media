import React, { useState, useEffect } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";
import * as postService from "../../../services/postService";

const CreatePostModal = ({ isOpen, onClose, onSuccess, editPost = null }) => {
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [imageUrls, setImageUrls] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      alert("Please write something in your post!");
      return;
    }

    try {
      setLoading(true);

      const postData = {
        content: content.trim(),
        privacy,
        imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
      };

      if (editPost) {
        await postService.updatePost(editPost.id, postData);
      } else {
        await postService.createPost(postData);
      }

      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving post:", error);
      alert(
        `Failed to ${editPost ? "update" : "create"} post. Please try again.`
      );
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
                        "https://via.placeholder.com/400x300?text=Invalid+URL";
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
                placeholder="Enter image URL"
                className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground"
                disabled={loading}
              />
              <Button
                type="button"
                onClick={handleAddImage}
                variant="outline"
                disabled={!newImageUrl.trim() || loading}
              >
                <Icon name="Plus" size={20} />
              </Button>
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
