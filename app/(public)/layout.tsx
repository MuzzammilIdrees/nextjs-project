import "@/app/globals.css"; // Use "@/globals.css" if it's in the root, not the app folder
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

// Notice the curly braces around { children } here!
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen p-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}