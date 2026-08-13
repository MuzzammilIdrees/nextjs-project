import { notFound } from "next/navigation";
import { getBlogById, updateBlog } from "../../../lib/actions";

// Notice that params is now typed as a Promise
export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  // 1. Await the params object
  const resolvedParams = await params;
  
  // 2. Fetch existing data using the resolved ID
  const post = await getBlogById(resolvedParams.id);
  
  if (!post) {
    notFound();
  }

  const updateAction = updateBlog.bind(null, post.id);

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Edit Post</h1>
      
      <form action={updateAction} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Post Title</label>
          <input
            type="text"
            name="title"
            defaultValue={post.title}
            required
            className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Short Excerpt</label>
          <input
            type="text"
            name="excerpt"
            defaultValue={post.excerpt}
            required
            className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Full Content</label>
          <textarea
            name="content"
            defaultValue={post.content}
            required
            rows={8}
            className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-gray-900 text-white py-3 mt-4 rounded-md hover:bg-gray-800 font-semibold"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}