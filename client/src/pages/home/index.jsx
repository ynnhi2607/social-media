import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/ui/Header";
import CreatePostFAB from "../../components/ui/CreatePostFAB";
import StoryCarousel from "./components/StoryCarousel";
import CreatePost from "./components/CreatePost";
import PostCard from "./components/PostCard";
import PostSkeleton from "./components/PostSkeleton";
import SuggestedUsers from "./components/SuggestedUsers";
import TrendingTopics from "./components/TrendingTopics";
import CreatePostModal from "./components/CreatePostModal";
import QuickLogin from "../../components/QuickLogin";
import * as postService from "../../services/postService";
import * as authService from "../../services/authService";

const Home = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [currentUser, setCurrentUser] = useState(authService.getUser());
  const [showQuickLogin, setShowQuickLogin] = useState(
    !authService.isAuthenticated(),
  );
  const observerRef = useRef(null);
  const loadingRef = useRef(null);

  const mockStories = [
    {
      id: 1,
      userName: "Emma Wilson",
      userAvatar:
        "https://img.rocket.new/generatedImages/rocket_gen_img_1497cd398-1763294526444.png",
      userAvatarAlt:
        "Professional headshot of young woman with blonde hair in casual blue sweater smiling warmly at camera",
      viewed: false,
    },
    {
      id: 2,
      userName: "Alex Chen",
      userAvatar:
        "https://img.rocket.new/generatedImages/rocket_gen_img_109c0a4b4-1763300818329.png",
      userAvatarAlt:
        "Professional portrait of Asian man with short black hair wearing white collared shirt in office setting",
      viewed: false,
    },
    {
      id: 3,
      userName: "Maria Garcia",
      userAvatar:
        "https://img.rocket.new/generatedImages/rocket_gen_img_183808107-1763293582927.png",
      userAvatarAlt:
        "Headshot of Hispanic woman with long dark hair in red blouse with confident professional expression",
      viewed: true,
    },
    {
      id: 4,
      userName: "James Taylor",
      userAvatar:
        "https://img.rocket.new/generatedImages/rocket_gen_img_16cf43196-1763296280905.png",
      userAvatarAlt:
        "Portrait of African American man with short hair and beard wearing navy blue suit jacket",
      viewed: false,
    },
    {
      id: 5,
      userName: "Sophie Anderson",
      userAvatar:
        "https://img.rocket.new/generatedImages/rocket_gen_img_1899c6c13-1765217063116.png",
      userAvatarAlt:
        "Young woman with curly brown hair in pink sweater smiling brightly outdoors with natural lighting",
      viewed: true,
    },
    {
      id: 6,
      userName: "David Kim",
      userAvatar:
        "https://img.rocket.new/generatedImages/rocket_gen_img_17e6cca9c-1763296759201.png",
      userAvatarAlt:
        "Asian man with glasses and short black hair in casual gray t-shirt with friendly smile",
      viewed: false,
    },
  ];

  const mockSuggestedUsers = [
    {
      id: 1,
      name: "Jennifer Lopez",
      avatar:
        "https://img.rocket.new/generatedImages/rocket_gen_img_1400f5ad7-1763296600804.png",
      avatarAlt:
        "Professional woman with long brown hair in elegant black dress with warm smile",
      mutualFriends: 12,
    },
    {
      id: 2,
      name: "Michael Brown",
      avatar:
        "https://img.rocket.new/generatedImages/rocket_gen_img_1ac1f10f8-1763293918596.png",
      avatarAlt:
        "Man with short brown hair and beard in casual denim jacket outdoors",
      mutualFriends: 8,
    },
    {
      id: 3,
      name: "Lisa Wang",
      avatar:
        "https://img.rocket.new/generatedImages/rocket_gen_img_101d5c1e5-1763296283361.png",
      avatarAlt:
        "Asian woman with straight black hair in professional white blouse in office environment",
      mutualFriends: 15,
    },
  ];

  const mockTrendingTopics = [
    { hashtag: "#SocialPastel", posts: 45200 },
    { hashtag: "#TechTrends2026", posts: 38900 },
    { hashtag: "#DesignInspiration", posts: 32100 },
    { hashtag: "#CreativeMinds", posts: 28500 },
    { hashtag: "#DigitalArt", posts: 24800 },
  ];

  const POSTS_PER_PAGE = 20;

  const transformPostData = (apiPost) => {
    return {
      id: apiPost.id,
      userName:
        apiPost.author?.fullName || apiPost.author?.username || "Unknown User",
      userAvatar:
        apiPost.author?.profilePicture || "https://via.placeholder.com/150",
      userAvatarAlt: `${apiPost.author?.fullName || apiPost.author?.username}'s avatar`,
      timestamp: new Date(apiPost.createdAt),
      content: apiPost.content,
      media:
        apiPost.images?.map((img) => ({
          type: "image",
          url: img.url,
          alt: `Image from ${apiPost.author?.username}'s post`,
        })) || [],
      likes: apiPost.likesCount || 0,
      comments: apiPost.commentsCount || 0,
      isLiked: apiPost.isLiked || false,
      privacy: apiPost.privacy,
      authorId: apiPost.author?.id,
    };
  };

  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const offset = (page - 1) * POSTS_PER_PAGE;
      const apiPosts = await postService.getAllPosts(POSTS_PER_PAGE, offset);

      if (apiPosts.length === 0) {
        setHasMore(false);
      } else {
        const transformedPosts = apiPosts.map(transformPostData);
        setPosts((prev) => [...prev, ...transformedPosts]);
        setPage((prev) => prev + 1);

        if (apiPosts.length < POSTS_PER_PAGE) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Error loading posts:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  const refreshPosts = useCallback(async () => {
    try {
      setLoading(true);
      setPosts([]);

      const apiPosts = await postService.getAllPosts(POSTS_PER_PAGE, 0);
      const transformedPosts = apiPosts.map(transformPostData);
      setPosts(transformedPosts);
      setPage(2);
      setHasMore(apiPosts.length >= POSTS_PER_PAGE);
    } catch (error) {
      console.error("Error refreshing posts:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMorePosts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 },
    );

    if (loadingRef?.current) {
      observer?.observe(loadingRef?.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef?.current) {
        observerRef?.current?.disconnect();
      }
    };
  }, [hasMore, loading, loadMorePosts]);

  const handleCreateStory = () => {
    navigate("/stories-create");
  };

  const handleStoryClick = (story) => {
    navigate(`/stories-view?id=${story?.id}`);
  };

  const handleLike = (postId, isLiked) => {
    console.log(`Post ${postId} ${isLiked ? "liked" : "unliked"}`);
  };

  const handleComment = (postId) => {
    navigate(`/post-detail?id=${postId}`);
  };

  const handleShare = (postId) => {
    console.log(`Share post ${postId}`);
  };

  const handleFollow = (userId) => {
    console.log(`Follow user ${userId}`);
  };

  const handleDeletePost = async (postId) => {
    try {
      await postService.deletePost(postId);
      // Refresh posts to show updated list
      await refreshPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingPost(null);
  };

  const handlePostSuccess = async () => {
    // Refresh posts after create/edit
    await refreshPosts();
  };

  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setShowQuickLogin(false);
    // Reload posts after login
    loadInitialPosts();
  };

  return (
    <div className="min-h-screen bg-background">
      {showQuickLogin && <QuickLogin onLoginSuccess={handleLoginSuccess} />}
      <Header />
      <main className="pt-16 pb-20 lg:pb-6">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
            <div className="lg:col-span-8 space-y-4 md:space-y-6">
              <StoryCarousel
                stories={mockStories}
                onCreateStory={handleCreateStory}
                onStoryClick={handleStoryClick}
              />

              <CreatePost onPostCreated={handlePostSuccess} />

              <div className="space-y-4 md:space-y-6">
                {posts?.map((post) => (
                  <PostCard
                    key={post?.id}
                    post={post}
                    onLike={handleLike}
                    onComment={handleComment}
                    onShare={handleShare}
                    onDelete={handleDeletePost}
                    onEdit={handleEditPost}
                  />
                ))}

                {loading && (
                  <>
                    <PostSkeleton />
                    <PostSkeleton />
                  </>
                )}

                <div ref={loadingRef} className="h-4" />

                {!hasMore && posts?.length > 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground text-sm md:text-base">
                      You've reached the end of your feed
                    </p>
                  </div>
                )}
              </div>
            </div>

            <aside className="hidden lg:block lg:col-span-4 space-y-4 md:space-y-6">
              <div className="sticky top-20 space-y-4 md:space-y-6">
                <SuggestedUsers
                  users={mockSuggestedUsers}
                  onFollow={handleFollow}
                />

                <TrendingTopics topics={mockTrendingTopics} />
              </div>
            </aside>
          </div>
        </div>
      </main>
      <CreatePostFAB onClick={handleOpenCreateModal} />

      {/* Create Post Modal (from FAB) */}
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        onSuccess={handlePostSuccess}
      />

      {/* Edit Post Modal */}
      <CreatePostModal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        onSuccess={handlePostSuccess}
        editPost={editingPost}
      />
    </div>
  );
};

export default Home;
