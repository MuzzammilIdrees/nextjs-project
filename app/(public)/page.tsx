import Link from "next/link";
import { getBlogs } from "@/lib/actions"; 

export default async function Home() {
  const blogs = await getBlogs();

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Latest Posts
          </h1>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-gray-600 font-medium hover:text-gray-900 transition-colors"
            >
              Admin Login
            </Link>
            <Link 
              href="/admin/create" 
              className="bg-blue-600 text-white font-semibold py-2.5 px-5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              + Create New Post
            </Link>
          </div>
        </div>

        {/* Blog Post Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {blogs.map((blog: any) => (
            <div key={blog.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-1">
                {blog.title}
              </h2>
              <p className="text-gray-600 mb-6 line-clamp-2 flex-grow">
                {blog.excerpt}
              </p>
              <Link 
                href={`/blog/${blog.id}`}
                className="text-blue-600 font-medium hover:text-blue-800 self-start"
              >
                Read Article &rarr;
              </Link>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}