import React from "react";

const NotificationBadge = ({ count, className = "" }) => {
  if (!count || count === 0) return null;

  const displayCount = count > 99 ? "99+" : count;

  return (
    <span
      className={`absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-medium bg-error text-error-foreground rounded-full ${className}`}
      aria-label={`${count} unread notifications`}
    >
      {displayCount}
    </span>
  );
};

export default NotificationBadge;
