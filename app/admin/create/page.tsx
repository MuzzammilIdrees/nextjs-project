import { createBlog } from "@/lib/actions";
import Link from "next/link";

export default function CreatePost() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        
        {/* Back Navigation */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            &larr; Back to Home
          </Link>
        </div>

        {/* Create Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Post</h1>
          
          <form action={createBlog} className="flex flex-col gap-6">
            
            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="font-semibold text-gray-900">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="My Awesome Blog Post"
                className="border border-gray-300 p-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="excerpt" className="font-semibold text-gray-900">Excerpt</label>
              <input
                type="text"
                id="excerpt"
                name="excerpt"
                placeholder="A short summary of the post..."
                className="border border-gray-300 p-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="content" className="font-semibold text-gray-900">Content</label>
              <textarea
                id="content"
                name="content"
                placeholder="Write your full post here..."
                className="border border-gray-300 p-3 rounded-lg text-gray-900 h-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-y"
                required
              />
            </div>

            <div className="pt-4 border-t border-gray-100 mt-2">
              <button 
                type="submit" 
                className="w-full sm:w-auto bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Publish Post
              </button>
            </div>
          </form>
        </div>

      </div>
    </main>
  );
}