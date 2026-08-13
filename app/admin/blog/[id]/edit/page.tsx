import { getBlogById, updateBlog } from "@/lib/actions";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const blog = await getBlogById(id);

  if (!blog) {
    notFound();
  }

  const updateBlogWithId = updateBlog.bind(null, Number(id));

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        
        <div className="mb-8">
          <Link 
            href={`/blog/${id}`} 
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            &larr; Cancel Edit
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Blog Post</h1>
          
          <form action={updateBlogWithId} className="flex flex-col gap-6">
            
            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="font-semibold text-gray-900">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                defaultValue={blog.title} 
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
                defaultValue={blog.excerpt} 
                className="border border-gray-300 p-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="content" className="font-semibold text-gray-900">Content</label>
              <textarea
                id="content"
                name="content"
                defaultValue={blog.content}
                className="border border-gray-300 p-3 rounded-lg text-gray-900 h-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-y"
                required
              />
            </div>

            <div className="pt-4 border-t border-gray-100 mt-2">
              <button 
                type="submit" 
                className="w-full sm:w-auto bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

      </div>
    </main>
  );
}