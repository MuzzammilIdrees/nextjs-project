import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="p-4 border-b">
      <Link href="/">Home</Link>
    </nav>
  );
}