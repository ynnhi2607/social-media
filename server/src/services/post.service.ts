import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function createPost(
  authorId: string,
  content: string,
  privacy: string = "public",
  imageUrls?: string[],
) {
  const post = await prisma.post.create({
    data: {
      authorId,
      content,
      privacy,
      ...(imageUrls &&
        imageUrls.length > 0 && {
          images: {
            create: imageUrls.map((url) => ({ url })),
          },
        }),
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          fullName: true,
        },
      },
      images: true,
    },
  });

  return post;
}

export async function getAllPosts(limit: number = 20, offset: number = 0) {
  const posts = await prisma.post.findMany({
    take: limit,
    skip: offset,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          fullName: true,
        },
      },
      images: true,
    },
  });

  return posts;
}

export async function getPostById(postId: string) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          fullName: true,
        },
      },
      images: true,
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  return post;
}

export async function updatePost(
  postId: string,
  content?: string,
  privacy?: string,
  imageUrls?: string[],
) {
  return prisma.$transaction(async (tx: any) => {
    const existingPost = await tx.post.findUnique({
      where: { id: postId },
    });
    if (!existingPost) {
      throw new Error("Post not found");
    }
    await tx.post.update({
      where: { id: postId },
      data: {
        ...(content !== undefined && { content }),
        ...(privacy !== undefined && { privacy }),
      },
    });
    if (imageUrls) {
      await tx.postImage.deleteMany({
        where: { postId },
      });
      if (imageUrls.length > 0) {
        await tx.postImage.createMany({
          data: imageUrls.map((url) => ({
            url,
            postId,
          })),
        });
      }
    }
    return tx.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
        images: true,
      },
    });
  });
}

export async function deletePost(postId: string) {
  const existingPost = await prisma.post.findUnique({
    where: { id: postId },
  });
  if (!existingPost) {
    throw new Error("Post not found");
  }
  await prisma.post.delete({
    where: { id: postId },
  });
  return { message: "Post deleted successfully" };
}

export async function getPostsByUserId(userId: string) {
  const posts = await prisma.post.findMany({
    where: { authorId: userId },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          fullName: true,
        },
      },
      images: true,
    },
  });
  return posts;
}
