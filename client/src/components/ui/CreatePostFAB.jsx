import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../AppIcon";

const CreatePostFAB = ({ className = "" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/create-post");
  };

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-20 right-6 lg:bottom-6 lg:right-6 z-50 w-14 h-14 bg-secondary text-secondary-foreground rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-250 flex items-center justify-center animate-pulse-soft ${className}`}
      aria-label="Create new post"
    >
      <Icon name="Plus" size={28} strokeWidth={2.5} />
    </button>
  );
};

export default CreatePostFAB;
