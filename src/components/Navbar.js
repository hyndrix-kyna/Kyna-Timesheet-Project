// components/Navbar.js

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <div className="text-lg font-bold">
          <Link href="/">
            My Website
          </Link>
        </div>
        <div>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="hover:text-gray-300">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-gray-300">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gray-300">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/inquiries" className="hover:text-gray-300">
                Inquiries
              </Link>
            </li>
            <li>
              <Link href="/account/login" className="hover:text-gray-300">
                Sign In
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
