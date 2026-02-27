import React from "react";

const PostSkeleton = () => {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden animate-pulse">
      <div className="p-4 md:p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-muted flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="h-4 bg-muted rounded w-32 mb-2" />
            <div className="h-3 bg-muted rounded w-20" />
          </div>
          <div className="w-8 h-8 bg-muted rounded-lg" />
        </div>

        <div className="space-y-2 mb-4">
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-5/6" />
          <div className="h-4 bg-muted rounded w-4/6" />
        </div>

        <div className="aspect-[4/3] bg-muted rounded-lg mb-4" />

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-4">
            <div className="h-8 bg-muted rounded w-16" />
            <div className="h-8 bg-muted rounded w-16" />
            <div className="h-8 bg-muted rounded w-16" />
          </div>
          <div className="h-8 bg-muted rounded w-8" />
        </div>
      </div>
    </div>
  );
};

export default PostSkeleton;
