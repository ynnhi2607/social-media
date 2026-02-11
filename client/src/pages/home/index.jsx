import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PostCard from "./components/PostCard";

const Home = () => {
  const navigate = useNavigate();

  // Function để generate mock posts
  const generateInitialPosts = () => {
    const mockPostsData = [
      {
        id: 1,
        userName: "Sarah Johnson",
        userAvatar:
          "https://img.rocket.new/generatedImages/rocket_gen_img_1ccaed995-1763294687911.png",
        userAvatarAlt:
          "Professional woman with shoulder-length blonde hair in light blue blouse smiling confidently",
        timestamp: new Date(Date.now() - 3600000),
        content:
          "Just finished an amazing project with the team! The pastel color palette we chose really brought everything together. Can't wait to share more details soon! 🎨✨",
        media: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1566647387313-9fda80664848",
            alt: "Modern workspace desk with laptop computer showing colorful design software, pastel pink notebook, white coffee mug, and succulent plant in soft natural lighting",
          },
        ],
        likes: 234,
        comments: 45,
        isLiked: false,
      },
      {
        id: 2,
        userName: "Marcus Williams",
        userAvatar:
          "https://img.rocket.new/generatedImages/rocket_gen_img_1d09b35e1-1763296580927.png",
        userAvatarAlt:
          "African American man with short hair and warm smile wearing casual gray hoodie outdoors",
        timestamp: new Date(Date.now() - 7200000),
        content:
          "Beautiful sunset at the beach today! Nature never fails to inspire. 🌅\n\nTaking a moment to appreciate the simple things in life. What's inspiring you today?",
        media: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1734540881994-10e30233373a",
            alt: "Stunning sunset over ocean beach with orange and pink sky reflecting on calm water, silhouette of person standing on sandy shore",
          },
        ],
        likes: 567,
        comments: 89,
        isLiked: true,
      },
    ];
    return mockPostsData;
  };

  const [posts, setPosts] = useState(generateInitialPosts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(2); // Start từ page 2 vì đã load page 1
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

  const generateMockPosts = (pageNum) => {
    const postsPerPage = 5;
    const startId = (pageNum - 1) * postsPerPage + 1;

    const mockPostsData = [
      {
        id: startId,
        userName: "Sarah Johnson",
        userAvatar:
          "https://img.rocket.new/generatedImages/rocket_gen_img_1ccaed995-1763294687911.png",
        userAvatarAlt:
          "Professional woman with shoulder-length blonde hair in light blue blouse smiling confidently",
        timestamp: new Date(Date.now() - 3600000),
        content:
          "Just finished an amazing project with the team! The pastel color palette we chose really brought everything together. Can\'t wait to share more details soon! 🎨✨",
        media: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1566647387313-9fda80664848",
            alt: "Modern workspace desk with laptop computer showing colorful design software, pastel pink notebook, white coffee mug, and succulent plant in soft natural lighting",
          },
        ],

        likes: 234,
        comments: 45,
        isLiked: false,
      },
      {
        id: startId + 1,
        userName: "Marcus Williams",
        userAvatar:
          "https://img.rocket.new/generatedImages/rocket_gen_img_1d09b35e1-1763296580927.png",
        userAvatarAlt:
          "African American man with short hair and warm smile wearing casual gray hoodie outdoors",
        timestamp: new Date(Date.now() - 7200000),
        content:
          "Beautiful sunset at the beach today! Nature never fails to inspire. 🌅\n\nTaking a moment to appreciate the simple things in life. What's inspiring you today?",
        media: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1734540881994-10e30233373a",
            alt: "Stunning sunset over ocean beach with orange and pink sky reflecting on calm water, silhouette of person standing on sandy shore",
          },
        ],

        likes: 567,
        comments: 89,
        isLiked: true,
      },
      {
        id: startId + 2,
        userName: "Emily Chen",
        userAvatar:
          "https://img.rocket.new/generatedImages/rocket_gen_img_189a307e9-1763295306313.png",
        userAvatarAlt:
          "Young Asian woman with long black hair in white t-shirt with bright cheerful smile in urban setting",
        timestamp: new Date(Date.now() - 10800000),
        content:
          "New blog post is live! Sharing my top 10 productivity tips for remote workers. Link in bio! 💻📝",
        media: [],
        likes: 189,
        comments: 34,
        isLiked: false,
      },
      {
        id: startId + 3,
        userName: "Daniel Martinez",
        userAvatar:
          "https://img.rocket.new/generatedImages/rocket_gen_img_14dd11a18-1763296507603.png",
        userAvatarAlt:
          "Hispanic man with short dark hair and beard in navy blue shirt with confident professional expression",
        timestamp: new Date(Date.now() - 14400000),
        content:
          "Coffee and code - the perfect combination for a productive morning! ☕💻\n\nWorking on something exciting that I can't wait to share with you all.",
        media: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1703647113881-4bd028df841f",
            alt: "Close-up of hands typing on laptop keyboard with steaming coffee cup beside it, warm indoor lighting creating cozy workspace atmosphere",
          },
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1702390683294-d5eda56112a3",
            alt: "Modern minimalist desk setup with laptop, notebook, pen, and small potted plant against white background",
          },
        ],

        likes: 423,
        comments: 67,
        isLiked: false,
      },
      {
        id: startId + 4,
        userName: "Olivia Thompson",
        userAvatar:
          "https://img.rocket.new/generatedImages/rocket_gen_img_1dd35fb3c-1766579843915.png",
        userAvatarAlt:
          "Woman with curly red hair in green sweater with warm friendly smile in natural outdoor setting",
        timestamp: new Date(Date.now() - 18000000),
        content:
          "Throwback to last weekend\'s hiking adventure! The views were absolutely breathtaking. Already planning the next trip! 🏔️🥾",
        media: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1735578123549-4cf3670dfb1c",
            alt: "Panoramic mountain landscape view with green valleys, rocky peaks, and blue sky with white clouds from hiking trail",
          },
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1529289252419-03cfc364face",
            alt: "Hiker with backpack standing on mountain summit overlooking vast wilderness landscape during golden hour",
          },
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1589989410241-fab0c86836a1",
            alt: "Narrow mountain trail winding through pine forest with sunlight filtering through trees",
          },
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1559506026-201e819588ec",
            alt: "Close-up of hiking boots on rocky mountain path with scenic valley view in background",
          },
        ],

        likes: 892,
        comments: 156,
        isLiked: true,
      },
    ];

    return mockPostsData;
  };

  const loadMorePosts = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);

    // Load ngay lập tức không delay
    const newPosts = generateMockPosts(page);
    setPosts((prev) => [...prev, ...newPosts]);
    setPage((prev) => prev + 1);
    setLoading(false);

    if (page >= 4) {
      setHasMore(false);
    }
  }, [page, loading, hasMore]);

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

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-16 pb-20 lg:pb-6">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
            <div className="lg:col-span-8 space-y-4 md:space-y-6">
              <div className="space-y-4 md:space-y-6">
                {posts?.map((post) => (
                  <PostCard
                    key={post?.id}
                    post={post}
                    onLike={handleLike}
                    onComment={handleComment}
                    onShare={handleShare}
                  />
                ))}
                {loading && (
                  <div className="bg-card rounded-xl p-6 animate-pulse">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-muted"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-muted rounded w-32 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-20"></div>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                    </div>
                    <div className="h-64 bg-muted rounded"></div>
                  </div>
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
              <div className="sticky top-20 space-y-4 md:space-y-6"></div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
