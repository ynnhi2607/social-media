import React from "react";
import Icon from "../../../components/AppIcon";

const TrendingTopics = ({ topics }) => {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base md:text-lg font-heading font-bold text-foreground">
          Trending Topics
        </h2>
        <Icon name="TrendingUp" size={20} color="var(--color-primary)" />
      </div>
      <div className="space-y-3">
        {topics?.map((topic, index) => (
          <button
            key={index}
            className="w-full text-left p-3 hover:bg-muted rounded-lg transition-colors duration-250"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary line-clamp-1">
                  {topic?.hashtag}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {topic?.posts?.toLocaleString()} posts
                </p>
              </div>
              <span className="text-xs font-bold text-muted-foreground flex-shrink-0">
                #{index + 1}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrendingTopics;
