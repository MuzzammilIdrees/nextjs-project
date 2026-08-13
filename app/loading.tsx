export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
      <div className="h-12 bg-gray-200 rounded-lg w-full mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-64 bg-gray-200 rounded-xl w-full"></div>
        ))}
      </div>
    </div>
  );
}