import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";

const PostCard = ({ post, onLike, onComment, onShare }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(post?.isLiked);
  const [likeCount, setLikeCount] = useState(post?.likes);
  const [showFullText, setShowFullText] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLike = (e) => {
    e?.stopPropagation();
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikeCount((prev) => (newLikedState ? prev + 1 : prev - 1));
    onLike(post?.id, newLikedState);
  };

  const handleComment = (e) => {
    e?.stopPropagation();
    onComment(post?.id);
  };

  const handleShare = (e) => {
    e?.stopPropagation();
    onShare(post?.id);
  };

  const handleCardClick = () => {
    navigate(`/post-detail?id=${post?.id}`);
  };

  const handleUserClick = (e) => {
    e?.stopPropagation();
    navigate("/user-profile");
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const postDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return postDate?.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const shouldTruncate = post?.content?.length > 200;
  const displayContent =
    shouldTruncate && !showFullText
      ? post?.content?.slice(0, 200) + "..."
      : post?.content;

  return (
    <article
      className="bg-card rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow duration-250 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="p-4 md:p-6">
        <div className="flex items-start gap-3 mb-4">
          <button onClick={handleUserClick} className="flex-shrink-0">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-primary/20">
              <Image
                src={post?.userAvatar}
                alt={post?.userAvatarAlt}
                className="w-full h-full object-cover"
              />
            </div>
          </button>

          <div className="flex-1 min-w-0">
            <button onClick={handleUserClick} className="hover:underline">
              <h3 className="font-heading font-bold text-sm md:text-base text-foreground line-clamp-1">
                {post?.userName}
              </h3>
            </button>
            <p className="text-xs md:text-sm text-muted-foreground">
              {formatTimestamp(post?.timestamp)}
            </p>
          </div>

          <button
            onClick={(e) => e?.stopPropagation()}
            className="p-2 hover:bg-muted rounded-lg transition-colors duration-250"
            aria-label="More options"
          >
            <Icon name="MoreVertical" size={20} />
          </button>
        </div>
        <div className="mb-4">
          <p className="text-sm md:text-base text-foreground whitespace-pre-wrap break-words">
            {displayContent}
          </p>
          {shouldTruncate && (
            <button
              onClick={(e) => {
                e?.stopPropagation();
                setShowFullText(!showFullText);
              }}
              className="text-sm text-primary hover:text-primary/80 font-medium mt-1"
            >
              {showFullText ? "Show less" : "Read more"}
            </button>
          )}
        </div>
        {post?.media && post?.media?.length > 0 && (
          <div
            className={`mb-4 rounded-lg overflow-hidden ${
              post?.media?.length === 1 ? "" : "grid grid-cols-2 gap-2"
            }`}
          >
            {post?.media?.slice(0, 4)?.map((media, index) => (
              <div
                key={index}
                className={`relative ${
                  post?.media?.length === 1 ? "aspect-[4/3]" : "aspect-square"
                } bg-muted overflow-hidden`}
              >
                {media?.type === "image" ? (
                  <>
                    <Image
                      src={media?.url}
                      alt={media?.alt}
                      className="w-full h-full object-cover"
                    />
                    {index === 3 && post?.media?.length > 4 && (
                      <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
                        <span className="text-2xl md:text-3xl font-bold text-background">
                          +{post?.media?.length - 4}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <Icon name="Play" size={48} color="var(--color-primary)" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-1 md:gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`gap-1.5 md:gap-2 ${isLiked ? "text-error" : ""}`}
            >
              <Icon
                name={isLiked ? "Heart" : "Heart"}
                size={20}
                className={isLiked ? "fill-current" : ""}
              />
              <span className="text-xs md:text-sm font-medium">
                {likeCount}
              </span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleComment}
              className="gap-1.5 md:gap-2"
            >
              <Icon name="MessageCircle" size={20} />
              <span className="text-xs md:text-sm font-medium">
                {post?.comments}
              </span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="gap-1.5 md:gap-2"
            >
              <Icon name="Share2" size={20} />
              <span className="text-xs md:text-sm font-medium hidden sm:inline">
                Share
              </span>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => e?.stopPropagation()}
            aria-label="Bookmark post"
          >
            <Icon name="Bookmark" size={20} />
          </Button>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
