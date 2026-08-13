"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { sql } from "./db";
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

  // 3. Insert the blog WITH the user_id
  await sql`
    INSERT INTO blogs (title, excerpt, content, user_id)
    VALUES (${title}, ${excerpt}, ${content}, ${userId})
  `;

  // 4. Clear the cache and redirect to dashboard
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

// READ (All)
export async function getBlogs() {
  const blogs = await sql`SELECT * FROM blogs ORDER BY created_at DESC`;
  return blogs;
}

// READ (Single)
export async function getBlogById(id: string) {
  const blogs = await sql`SELECT * FROM blogs WHERE id = ${id}`;
  return blogs[0];
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

  // Enforce ownership: Only update if the user_id matches the logged-in user
  await sql`
    UPDATE blogs 
    SET title = ${title}, excerpt = ${excerpt}, content = ${content}
    WHERE id = ${id} AND user_id = ${userId}
  `;

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
  await sql`DELETE FROM blogs WHERE id = ${id} AND user_id = ${userId}`;
  
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function getUserBlogs(userId: string | number) {
  // Fetch only the blogs where the user_id matches the logged-in user
  const blogs = await sql`
    SELECT * FROM blogs 
    WHERE user_id = ${userId} 
    ORDER BY id DESC
  `;
  
  return blogs;
}

export async function getUsers() {
  // Fetch all users except passwords for security
  const users = await sql`
    SELECT id, username, role 
    FROM users 
    ORDER BY id ASC
  `;
  return users;
}

export async function deleteUser(id: number) {
  // Security Check: Verify session AND Admin role
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    throw new Error("Unauthorized: Only admins can delete users.");
  }

  await sql`DELETE FROM users WHERE id = ${id}`;
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
  await sql`
    INSERT INTO users (username, password, role)
    VALUES (${username}, ${password}, ${role})
  `;

  // Refresh the page so the new user instantly appears in the table
  revalidatePath("/admin/users");
}