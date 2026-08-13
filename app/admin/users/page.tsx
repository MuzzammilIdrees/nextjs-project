import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getUsers, deleteUser, createUser } from "@/lib/actions"; // <-- Added createUser
import Link from "next/link";

export default async function UsersManagementPage() {
  // 1. Verify session and Admin role
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  const role = (session.user as any).role;
  if (role !== "admin") {
    redirect("/admin");
  }

  // 2. Fetch all users from the database
  const siteUsers = await getUsers();

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Site Users</h1>
          <Link 
            href="/admin" 
            className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            &larr; Back to Dashboard
          </Link>
        </div>

{/* --- NEW: Add User Form Section --- */}
<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
  <h2 className="text-xl font-bold text-gray-900 mb-4">Add New User</h2>
  <form action={createUser} className="flex flex-col md:flex-row gap-4 items-end">
    
    <div className="flex-1 flex flex-col gap-2 w-full">
      <label htmlFor="username" className="text-sm font-semibold text-gray-900">Username</label>
      <input 
        type="text" 
        id="username" 
        name="username" 
        required 
        className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full text-black bg-white" 
      />
    </div>
    
    <div className="flex-1 flex flex-col gap-2 w-full">
      <label htmlFor="password" className="text-sm font-semibold text-gray-900">Password</label>
      <input 
        type="password" 
        id="password" 
        name="password" 
        required 
        className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full text-black bg-white" 
      />
    </div>

    <div className="flex flex-col gap-2 w-full md:w-32">
      <label htmlFor="role" className="text-sm font-semibold text-gray-900">Role</label>
      <select 
        id="role" 
        name="role" 
        className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer w-full text-black bg-white"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
    </div>

    <button type="submit" className="bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-sm h-[46px] w-full md:w-auto shrink-0">
      Create User
    </button>
    
  </form>
</div>
{/* --- END NEW SECTION --- */}

        {/* The Users Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-900">ID</th>
                <th className="p-4 font-semibold text-gray-900">Username</th>
                <th className="p-4 font-semibold text-gray-900">Role</th>
                <th className="p-4 font-semibold text-gray-900 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {siteUsers.map((user: any) => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-600">{user.id}</td>
                  <td className="p-4 font-medium text-gray-900">{user.username}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {/* Prevent the admin from deleting themselves */}
                    {user.username !== session.user?.name && (
                      <form action={async () => {
                        "use server";
                        await deleteUser(user.id);
                      }}>
                        <button 
                          type="submit"
                          className="text-red-600 hover:text-red-800 font-medium text-sm bg-red-50 px-3 py-1.5 rounded-md transition-colors"
                        >
                          Delete
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </main>
  );
}