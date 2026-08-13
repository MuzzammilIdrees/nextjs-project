import "@/app/globals.css"; // Note: adjust this path if your globals.css is located elsewhere

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* We can add a custom Admin Navbar or Sidebar right here later! */}
        {children}
      </body>
    </html>
  );
}