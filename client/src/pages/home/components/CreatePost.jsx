import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import CreatePostModal from "./CreatePostModal";

const CreatePost = ({ onPostCreated }) => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSuccess = () => {
    onPostCreated && onPostCreated();
  };

  return (
    <>
      <div className="bg-card rounded-xl shadow-sm border border-border p-4 md:p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Icon name="User" size={24} color="var(--color-primary)" />
          </div>

          <button
            onClick={handleOpenModal}
            className="flex-1 px-4 py-2.5 md:py-3 bg-muted hover:bg-muted/80 rounded-full text-left text-sm md:text-base text-muted-foreground transition-colors duration-250"
          >
            What's on your mind?
          </button>

          <Button
            variant="default"
            size="icon"
            onClick={handleOpenModal}
            className="flex-shrink-0"
            aria-label="Create post"
          >
            <Icon name="Plus" size={20} />
          </Button>
        </div>

        <div className="flex items-center gap-2 md:gap-4 mt-4 pt-4 border-t border-border">
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 hover:bg-muted rounded-lg transition-colors duration-250 flex-1 justify-center"
          >
            <Icon name="Image" size={20} color="var(--color-success)" />
            <span className="text-xs md:text-sm font-medium text-foreground">
              Photo
            </span>
          </button>

          <button
            onClick={handleOpenModal}
            className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 hover:bg-muted rounded-lg transition-colors duration-250 flex-1 justify-center"
          >
            <Icon name="Video" size={20} color="var(--color-error)" />
            <span className="text-xs md:text-sm font-medium text-foreground">
              Video
            </span>
          </button>

          <button
            onClick={handleOpenModal}
            className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 hover:bg-muted rounded-lg transition-colors duration-250 flex-1 justify-center"
          >
            <Icon name="Smile" size={20} color="var(--color-warning)" />
            <span className="text-xs md:text-sm font-medium text-foreground hidden sm:inline">
              Feeling
            </span>
          </button>
        </div>
      </div>

      <CreatePostModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default CreatePost;
