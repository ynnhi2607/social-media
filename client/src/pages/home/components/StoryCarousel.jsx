import React, { useRef, useState } from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";

const StoryCarousel = ({ stories, onCreateStory, onStoryClick }) => {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScrollPosition = () => {
    if (scrollContainerRef?.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef?.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef?.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollContainerRef?.current?.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScrollPosition, 300);
    }
  };

  return (
    <div className="relative bg-card rounded-xl p-4 md:p-6 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-heading font-bold text-foreground">
          Stories
        </h2>
        <button
          onClick={onCreateStory}
          className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-250"
        >
          <Icon name="Plus" size={16} />
          <span className="text-sm font-medium hidden sm:inline">Create</span>
        </button>
      </div>
      <div className="relative">
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 bg-card/95 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-muted transition-colors duration-250"
            aria-label="Scroll left"
          >
            <Icon name="ChevronLeft" size={20} />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          onScroll={checkScrollPosition}
          className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-custom pb-2"
          style={{ scrollbarWidth: "thin" }}
        >
          {stories?.map((story) => (
            <button
              key={story?.id}
              onClick={() => onStoryClick(story)}
              className="flex-shrink-0 group"
            >
              <div className="relative">
                <div
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-full p-0.5 ${
                    story?.viewed
                      ? "bg-muted"
                      : "bg-gradient-to-br from-secondary via-primary to-accent"
                  }`}
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-card p-0.5">
                    <Image
                      src={story?.userAvatar}
                      alt={story?.userAvatarAlt}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>
                {!story?.viewed && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-success rounded-full border-2 border-card flex items-center justify-center">
                    <Icon
                      name="Plus"
                      size={12}
                      color="var(--color-success-foreground)"
                    />
                  </div>
                )}
              </div>
              <p className="mt-2 text-xs md:text-sm text-center text-foreground font-medium line-clamp-1 max-w-[64px] md:max-w-[80px]">
                {story?.userName}
              </p>
            </button>
          ))}
        </div>

        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 bg-card/95 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-muted transition-colors duration-250"
            aria-label="Scroll right"
          >
            <Icon name="ChevronRight" size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default StoryCarousel;
