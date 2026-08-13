import Link from "next/link";
import "../../globals.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex h-screen bg-gray-100">
        {/* Admin Sidebar */}
        <aside className="w-64 bg-gray-900 text-white flex flex-col">
          <div className="p-6 text-2xl font-bold border-b border-gray-800">
            Portal
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <Link href="/admin/dashboard" className="block p-3 rounded hover:bg-gray-800">
              My Blogs
            </Link>
            <Link href="/admin/users" className="block p-3 rounded hover:bg-gray-800">
              Manage Users (Admin)
            </Link>
          </nav>
          <div className="p-4 border-t border-gray-800">
            <button className="w-full p-2 bg-red-600 rounded hover:bg-red-700">
              Logout
            </button>
          </div>
        </aside>

        {/* Dashboard Content */}
        <main className="flex-1 p-10 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}