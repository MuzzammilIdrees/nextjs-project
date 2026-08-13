export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Portal Login</h1>
        <form className="flex flex-col gap-4">
          <input 
            type="text" 
            name="username" 
            placeholder="Username" 
            required 
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            required 
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="bg-gray-900 text-white p-3 rounded hover:bg-gray-800 font-bold">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}