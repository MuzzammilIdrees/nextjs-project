import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserBlogs } from "@/lib/actions";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  // 1. Authenticate the user
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  // 2. Extract user details
  const userId = (session.user as any).id;
  const role = (session.user as any).role;
  
  // 3. Fetch their personal blogs
  const userBlogs = await getUserBlogs(userId);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Profile & Navigation Section */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {session.user.name}!
          </h1>
          <p className="text-gray-600 mb-6">
            You are logged in with the <strong>{role}</strong> role.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/admin/create" 
              className="bg-blue-600 text-white font-semibold py-2.5 px-5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              + Create New Post
            </Link>
            
            {/* This button ONLY appears for administrators */}
            {role === "admin" && (
              <Link 
                href="/admin/users" 
                className="bg-gray-900 text-white font-semibold py-2.5 px-5 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
              >
                Manage Site Users
              </Link>
            )}
            
            <Link 
              href="/" 
              className="bg-white text-gray-700 border border-gray-300 font-semibold py-2.5 px-5 rounded-lg hover:bg-gray-50 transition-colors shadow-sm ml-auto"
            >
              View Live Site &rarr;
            </Link>
          </div>
        </div>

        {/* User's Blogs Management Section */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Blog Posts</h2>
        
        {userBlogs.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-600">You haven't written any posts yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {userBlogs.map((blog: any) => (
              <div key={blog.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{blog.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-1">{blog.excerpt}</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Link 
                    href={`/admin/blog/${blog.id}/edit`} 
                    className="text-blue-600 font-medium hover:text-blue-800 bg-blue-50 px-4 py-2 rounded-md transition-colors w-full sm:w-auto text-center"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}