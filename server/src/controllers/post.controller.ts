import { Request, Response } from "express";
import * as postService from "../services/post.service.js";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export async function createPostController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { content, privacy, imageUrls } = req.body;
    const authorId = req.user?.id;
    if (!authorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const post = await postService.createPost(
      authorId,
      content,
      privacy,
      imageUrls,
    );
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Fail to create post" });
  }
}

export async function getAllPostsController(req: Request, res: Response) {
  try {
    const limit = Number(req.query.limit) || 20;
    const offset = Number(req.query.offset) || 0;
    const posts = await postService.getAllPosts(limit, offset);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Fail to get posts" });
  }
}
export async function getPostByIdController(req: Request, res: Response) {
  try {
    const { postId } = req.params;
    const post = await postService.getPostById(postId as string);
    res.status(200).json(post);
  } catch (error) {
    if (error instanceof Error && error.message === "Post not found") {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(500).json({ message: "Fail to get post" });
  }
}

export async function updatePostController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { postId } = req.params;
    const { content, privacy, imageUrls } = req.body;
    const authorId = req.user?.id;
    if (!authorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const existingPost = await postService.getPostById(postId as string);
    if (existingPost.author.id !== authorId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const updatedPost = await postService.updatePost(
      postId as string,
      content,
      privacy,
      imageUrls,
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    if (error instanceof Error && error.message === "Post not found") {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(500).json({ message: "Fail to update post" });
  }
}

export async function deletePostController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { postId } = req.params;
    const authorId = req.user?.id;
    if (!authorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const existingPost = await postService.getPostById(postId as string);
    if (existingPost.author.id !== authorId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    await postService.deletePost(postId as string);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error && error.message === "Post not found") {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(500).json({ message: "Fail to delete post" });
  }
}

export async function getPostsByUserIdController(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const posts = await postService.getPostsByUserId(userId as string);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Fail to get posts by user" });
  }
}
