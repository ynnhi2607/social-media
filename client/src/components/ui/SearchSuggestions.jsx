import React from "react";
import Icon from "../AppIcon";

const SearchSuggestions = ({
  recentSearches = [],
  suggestedUsers = [],
  onSuggestionClick,
  className = "",
}) => {
  if (recentSearches?.length === 0 && suggestedUsers?.length === 0) {
    return null;
  }

  return (
    <div
      className={`bg-card rounded-lg shadow-lg border border-border overflow-hidden animate-slide-down ${className}`}
    >
      {recentSearches?.length > 0 && (
        <div className="p-3 border-b border-border">
          <p className="text-xs font-caption font-medium text-muted-foreground mb-2">
            Recent Searches
          </p>
          <div className="space-y-1">
            {recentSearches?.map((search, index) => (
              <button
                key={index}
                onClick={() => onSuggestionClick(search)}
                className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-muted transition-colors duration-250"
              >
                <Icon
                  name="Clock"
                  size={16}
                  className="text-muted-foreground flex-shrink-0"
                />
                <span className="text-sm text-foreground truncate">
                  {search}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
      {suggestedUsers?.length > 0 && (
        <div className="p-3">
          <p className="text-xs font-caption font-medium text-muted-foreground mb-2">
            Suggested Users
          </p>
          <div className="space-y-1">
            {suggestedUsers?.map((user, index) => (
              <button
                key={index}
                onClick={() => onSuggestionClick(user)}
                className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-muted transition-colors duration-250"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Icon name="User" size={16} color="var(--color-primary)" />
                </div>
                <span className="text-sm text-foreground truncate">{user}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSuggestions;
