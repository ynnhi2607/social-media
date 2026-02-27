import React from "react";
import { useNavigate } from "react-router-dom";

import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";

const SuggestedUsers = ({ users, onFollow }) => {
  const navigate = useNavigate();

  const handleUserClick = (userId) => {
    navigate("/user-profile");
  };

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base md:text-lg font-heading font-bold text-foreground">
          Suggested For You
        </h2>
        <button className="text-sm text-primary hover:text-primary/80 font-medium">
          See All
        </button>
      </div>
      <div className="space-y-3">
        {users?.map((user) => (
          <div key={user?.id} className="flex items-center gap-3">
            <button
              onClick={() => handleUserClick(user?.id)}
              className="flex-shrink-0"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-primary/20">
                <Image
                  src={user?.avatar}
                  alt={user?.avatarAlt}
                  className="w-full h-full object-cover"
                />
              </div>
            </button>

            <div className="flex-1 min-w-0">
              <button
                onClick={() => handleUserClick(user?.id)}
                className="hover:underline text-left"
              >
                <h3 className="font-heading font-bold text-sm text-foreground line-clamp-1">
                  {user?.name}
                </h3>
              </button>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {user?.mutualFriends} mutual friends
              </p>
            </div>

            <Button
              variant="default"
              size="sm"
              onClick={() => onFollow(user?.id)}
              className="flex-shrink-0"
            >
              Follow
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedUsers;
