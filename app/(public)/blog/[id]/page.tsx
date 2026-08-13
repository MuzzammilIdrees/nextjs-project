import { getBlogById, deleteBlog } from "@/lib/actions";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function BlogPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. Await the params to correctly extract the ID in Next.js 15+
  const { id } = await params;
  
  // 2. Fetch the blog data using the resolved ID
  const blog = await getBlogById(id);
  
  // 3. Fetch the active session
  const session = await getServerSession(authOptions);

  if (!blog) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900">Blog not found</h1>
      </main>
    );
  }

  // Security Check: Is the person viewing this page the original author?
  const isAuthor = session?.user && (session.user as any).id === blog.user_id;

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        
        <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium mb-8 inline-block">
          &larr; Back to all posts
        </Link>

        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
          {blog.title}
        </h1>
        
        <div className="prose max-w-none text-gray-700 mb-10 whitespace-pre-wrap">
          {blog.content}
        </div>

        {/* --- CONDITIONAL RENDERING --- */}
        {/* These buttons will ONLY render if the logged-in user wrote this specific post */}
        {isAuthor && (
          <div className="flex items-center gap-4 pt-6 border-t border-gray-100 mt-8">
            <Link 
              href={`/admin/blog/${blog.id}/edit`} 
              className="bg-gray-100 text-gray-700 font-semibold py-2.5 px-6 rounded-lg hover:bg-gray-200 transition-colors shadow-sm"
            >
              Edit Post
            </Link>
            
            <form action={async () => {
              "use server";
              await deleteBlog(blog.id);
            }}>
              <button 
                type="submit" 
                className="bg-red-50 text-red-600 font-semibold py-2.5 px-6 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors shadow-sm"
              >
                Delete Post
              </button>
            </form>
          </div>
        )}
        {/* ------------------------------- */}
        
      </div>
    </main>
  );
}