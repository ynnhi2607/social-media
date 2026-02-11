import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Icon from "../AppIcon";
import Button from "./Button";
import Input from "./Input";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [messageCount, setMessageCount] = useState(2);

  const searchRef = useRef(null);
  const profileMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef?.current && !searchRef?.current?.contains(event?.target)) {
        setShowSearchSuggestions(false);
      }
      if (
        profileMenuRef?.current &&
        !profileMenuRef?.current?.contains(event?.target)
      ) {
        setShowProfileMenu(false);
      }
      if (
        mobileMenuRef?.current &&
        !mobileMenuRef?.current?.contains(event?.target)
      ) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showMobileMenu]);

  const handleSearchChange = (e) => {
    const value = e?.target?.value;
    setSearchQuery(value);
    setShowSearchSuggestions(value?.length > 0);
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearchSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSearchSuggestions(false);
    navigate(`/user-profile?user=${encodeURIComponent(suggestion)}`);
  };

  const handleProfileMenuToggle = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleMobileMenuToggle = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const isActive = (path) => location?.pathname === path;

  const recentSearches = [
    "Sarah Johnson",
    "Tech Community",
    "Design Inspiration",
  ];
  const suggestedUsers = ["Emma Wilson", "Alex Chen", "Maria Garcia"];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[1000] bg-card shadow-md">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          <div className="flex items-center gap-4 lg:gap-6">
            <Link
              to="/home-feed"
              className="flex items-center gap-2 transition-transform duration-250 hover:scale-105"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/20">
                <Icon name="Heart" size={24} color="var(--color-primary)" />
              </div>
              <span className="hidden sm:block font-heading font-bold text-xl text-foreground">
                SocialPastel
              </span>
            </Link>

            <button
              onClick={handleMobileMenuToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors duration-250"
              aria-label="Toggle mobile menu"
            >
              <Icon name={showMobileMenu ? "X" : "Menu"} size={24} />
            </button>
          </div>

          <div
            className="hidden lg:flex items-center flex-1 max-w-xl mx-6"
            ref={searchRef}
          >
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Input
                type="search"
                placeholder="Search users, groups, or content..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="w-full pr-10"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-250"
              >
                <Icon name="Search" size={20} />
              </button>
            </form>

            {showSearchSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-lg shadow-lg border border-border overflow-hidden animate-slide-down">
                {recentSearches?.length > 0 && (
                  <div className="p-3 border-b border-border">
                    <p className="text-xs font-caption font-medium text-muted-foreground mb-2">
                      Recent Searches
                    </p>
                    {recentSearches?.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(search)}
                        className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-muted transition-colors duration-250"
                      >
                        <Icon
                          name="Clock"
                          size={16}
                          className="text-muted-foreground"
                        />
                        <span className="text-sm text-foreground">
                          {search}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                <div className="p-3">
                  <p className="text-xs font-caption font-medium text-muted-foreground mb-2">
                    Suggested Users
                  </p>
                  {suggestedUsers?.map((user, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(user)}
                      className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-muted transition-colors duration-250"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Icon
                          name="User"
                          size={16}
                          color="var(--color-primary)"
                        />
                      </div>
                      <span className="text-sm text-foreground">{user}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <nav className="hidden lg:flex items-center gap-2">
            <Link
              to="/home-feed"
              className={`p-2 rounded-lg transition-all duration-250 ${
                isActive("/home-feed")
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-foreground"
              }`}
              aria-label="Home"
            >
              <Icon name="Home" size={24} />
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/create-post")}
              className="relative"
              aria-label="Create post"
            >
              <Icon name="Plus" size={24} />
            </Button>

            <Link
              to="/messages"
              className="relative p-2 rounded-lg hover:bg-muted transition-colors duration-250"
              aria-label="Messages"
            >
              <Icon name="MessageCircle" size={24} />
              {messageCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-medium bg-error text-error-foreground rounded-full">
                  {messageCount}
                </span>
              )}
            </Link>

            <Link
              to="/notifications"
              className="relative p-2 rounded-lg hover:bg-muted transition-colors duration-250"
              aria-label="Notifications"
            >
              <Icon name="Bell" size={24} />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-medium bg-error text-error-foreground rounded-full">
                  {notificationCount}
                </span>
              )}
            </Link>

            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={handleProfileMenuToggle}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors duration-250"
                aria-label="Profile menu"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Icon name="User" size={20} color="var(--color-primary)" />
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-card rounded-lg shadow-lg border border-border overflow-hidden animate-slide-down">
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Icon
                          name="User"
                          size={24}
                          color="var(--color-primary)"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          Guest User
                        </p>
                        <p className="text-sm text-muted-foreground">@guest</p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <Link
                      to="/user-profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors duration-250"
                    >
                      <Icon name="User" size={20} />
                      <span className="text-sm">My Profile</span>
                    </Link>
                    <Link
                      to="/edit-profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors duration-250"
                    >
                      <Icon name="Settings" size={20} />
                      <span className="text-sm">Edit Profile</span>
                    </Link>
                    <Link
                      to="/groups"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors duration-250"
                    >
                      <Icon name="Users" size={20} />
                      <span className="text-sm">Groups</span>
                    </Link>
                    <Link
                      to="/events"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors duration-250"
                    >
                      <Icon name="Calendar" size={20} />
                      <span className="text-sm">Events</span>
                    </Link>
                    <Link
                      to="/live-streaming"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors duration-250"
                    >
                      <Icon name="Video" size={20} />
                      <span className="text-sm">Live Streaming</span>
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors duration-250"
                    >
                      <Icon name="Settings" size={20} />
                      <span className="text-sm">Settings & Privacy</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>
      {showMobileMenu && (
        <div
          className="fixed inset-0 z-[999] bg-background lg:hidden"
          ref={mobileMenuRef}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-heading font-bold text-xl text-foreground">
                Menu
              </span>
              <button
                onClick={handleMobileMenuToggle}
                className="p-2 rounded-lg hover:bg-muted transition-colors duration-250"
                aria-label="Close menu"
              >
                <Icon name="X" size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="mb-6">
                <form onSubmit={handleSearchSubmit}>
                  <Input
                    type="search"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </form>
              </div>

              <nav className="space-y-2">
                <Link
                  to="/home-feed"
                  onClick={handleMobileMenuToggle}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-250 ${
                    isActive("/home-feed")
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <Icon name="Home" size={24} />
                  <span className="font-medium">Home</span>
                </Link>

                <Link
                  to="/user-profile"
                  onClick={handleMobileMenuToggle}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors duration-250"
                >
                  <Icon name="User" size={24} />
                  <span className="font-medium">Profile</span>
                </Link>

                <Link
                  to="/messages"
                  onClick={handleMobileMenuToggle}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors duration-250"
                >
                  <Icon name="MessageCircle" size={24} />
                  <span className="font-medium">Messages</span>
                  {messageCount > 0 && (
                    <span className="ml-auto flex items-center justify-center w-6 h-6 text-xs font-medium bg-error text-error-foreground rounded-full">
                      {messageCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/notifications"
                  onClick={handleMobileMenuToggle}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors duration-250"
                >
                  <Icon name="Bell" size={24} />
                  <span className="font-medium">Notifications</span>
                  {notificationCount > 0 && (
                    <span className="ml-auto flex items-center justify-center w-6 h-6 text-xs font-medium bg-error text-error-foreground rounded-full">
                      {notificationCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/groups"
                  onClick={handleMobileMenuToggle}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors duration-250"
                >
                  <Icon name="Users" size={24} />
                  <span className="font-medium">Groups</span>
                </Link>

                <Link
                  to="/events"
                  onClick={handleMobileMenuToggle}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors duration-250"
                >
                  <Icon name="Calendar" size={24} />
                  <span className="font-medium">Events</span>
                </Link>

                <Link
                  to="/live-streaming"
                  onClick={handleMobileMenuToggle}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors duration-250"
                >
                  <Icon name="Video" size={24} />
                  <span className="font-medium">Live Streaming</span>
                </Link>

                <Link
                  to="/settings"
                  onClick={handleMobileMenuToggle}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors duration-250"
                >
                  <Icon name="Settings" size={24} />
                  <span className="font-medium">Settings</span>
                </Link>
              </nav>
            </div>

            <div className="p-4 border-t border-border">
              <Button
                variant="default"
                fullWidth
                iconName="Plus"
                iconPosition="left"
                onClick={() => {
                  handleMobileMenuToggle();
                  navigate("/create-post");
                }}
              >
                Create Post
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="fixed bottom-0 left-0 right-0 z-[1000] lg:hidden bg-card border-t border-border">
        <nav className="flex items-center justify-around h-16 px-2">
          <Link
            to="/home-feed"
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors duration-250 ${
              isActive("/home-feed") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Icon name="Home" size={24} />
            <span className="text-xs font-caption">Home</span>
          </Link>

          <button
            onClick={() => navigate("/create-post")}
            className="flex flex-col items-center gap-1 p-2 rounded-lg text-muted-foreground transition-colors duration-250"
          >
            <Icon name="Plus" size={24} />
            <span className="text-xs font-caption">Create</span>
          </button>

          <Link
            to="/messages"
            className="relative flex flex-col items-center gap-1 p-2 rounded-lg text-muted-foreground transition-colors duration-250"
          >
            <Icon name="MessageCircle" size={24} />
            <span className="text-xs font-caption">Messages</span>
            {messageCount > 0 && (
              <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs font-medium bg-error text-error-foreground rounded-full">
                {messageCount}
              </span>
            )}
          </Link>

          <Link
            to="/notifications"
            className="relative flex flex-col items-center gap-1 p-2 rounded-lg text-muted-foreground transition-colors duration-250"
          >
            <Icon name="Bell" size={24} />
            <span className="text-xs font-caption">Alerts</span>
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs font-medium bg-error text-error-foreground rounded-full">
                {notificationCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Header;
