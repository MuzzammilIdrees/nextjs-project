"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { prisma } from "./prisma"; // Replaced raw SQL with Prisma Client
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// CREATE
export async function createBlog(formData: FormData) {
  // 1. Get the current logged-in user's session
  const session = await getServerSession(authOptions);
  
  // 2. If they aren't logged in, stop the function
  if (!session || !session.user) {
    throw new Error("You must be logged in to create a post.");
  }

  // Extract the user ID from the session
  const userId = (session.user as any).id;

  const title = formData.get("title") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;

  // 3. Insert the blog using Prisma
  await prisma.blog.create({
    data: {
      title,
      excerpt,
      content,
      user_id: Number(userId),
    },
  });

  // 4. Clear the cache and redirect to dashboard
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

// READ (All)
export async function getBlogs() {
  const blogs = await prisma.blog.findMany({
    orderBy: { created_at: "desc" },
  });
  return blogs;
}

// READ (Single)
export async function getBlogById(id: string) {
  const blog = await prisma.blog.findUnique({
    where: { id: Number(id) },
  });
  return blog;
}

// UPDATE
export async function updateBlog(id: number, formData: FormData) {
  // Security Check: Verify session
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }
  const userId = (session.user as any).id;

  const title = formData.get("title") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;

  // Enforce ownership using updateMany (ensures both ID and user_id match)
  await prisma.blog.updateMany({
    where: { 
      id: Number(id),
      user_id: Number(userId),
    },
    data: { title, excerpt, content },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect(`/blog/${id}`);
}

// DELETE
export async function deleteBlog(id: number) {
  // Security Check: Verify session
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }
  const userId = (session.user as any).id;

  // Enforce ownership: Only delete if the user_id matches the logged-in user
  await prisma.blog.deleteMany({
    where: { 
      id: Number(id),
      user_id: Number(userId),
    },
  });
  
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function getUserBlogs(userId: string | number) {
  // Fetch only the blogs where the user_id matches the logged-in user
  const blogs = await prisma.blog.findMany({
    where: { user_id: Number(userId) },
    orderBy: { id: "desc" },
  });
  
  return blogs;
}

export async function getUsers() {
  // Fetch all users except passwords for security
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      role: true,
    },
    orderBy: { id: "asc" },
  });
  return users;
}

export async function deleteUser(id: number) {
  // Security Check: Verify session AND Admin role
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    throw new Error("Unauthorized: Only admins can delete users.");
  }

  await prisma.user.delete({
    where: { id: Number(id) },
  });
  
  // Refresh the page data after deletion
  revalidatePath("/admin/users");
}

export async function createUser(formData: FormData) {
  // Security Check: Verify session AND Admin role
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    throw new Error("Unauthorized: Only admins can create users.");
  }

  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  // Insert the new user into the database
  await prisma.user.create({
    data: { username, password, role },
  });

  // Refresh the page so the new user instantly appears in the table
  revalidatePath("/admin/users");
}