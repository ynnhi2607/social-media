import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Icon from "../AppIcon";

const UserAvatarDropdown = ({
  isOpen,
  onClose,
  userName = "Guest User",
  userHandle = "@guest",
  className = "",
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef?.current &&
        !dropdownRef?.current?.contains(event?.target)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems = [
    { icon: "User", label: "My Profile", path: "/user-profile" },
    { icon: "Settings", label: "Edit Profile", path: "/edit-profile" },
    { icon: "Users", label: "Groups", path: "/groups" },
    { icon: "Calendar", label: "Events", path: "/events" },
    { icon: "Video", label: "Live Streaming", path: "/live-streaming" },
    { icon: "Settings", label: "Settings & Privacy", path: "/settings" },
  ];

  return (
    <div
      ref={dropdownRef}
      className={`absolute right-0 top-full mt-2 w-64 bg-card rounded-lg shadow-lg border border-border overflow-hidden animate-slide-down ${className}`}
    >
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Icon name="User" size={24} color="var(--color-primary)" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-foreground truncate">{userName}</p>
            <p className="text-sm text-muted-foreground truncate">
              {userHandle}
            </p>
          </div>
        </div>
      </div>
      <nav className="py-2">
        {menuItems?.map((item, index) => (
          <Link
            key={index}
            to={item?.path}
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors duration-250"
          >
            <Icon name={item?.icon} size={20} className="flex-shrink-0" />
            <span className="text-sm text-foreground">{item?.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default UserAvatarDropdown;
