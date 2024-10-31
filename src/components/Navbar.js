// components/Navbar.js

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact Us", path: "/contact" },
    { name: "Inquiries", path: "/inquiries" },
    { name: "Sign In", path: "/account/login" },
  ];

  return (
    <nav className="bg-background text-foreground p-4 border-b border-border transition-colors duration-200 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold">
          <Link href="/" className="hover:text-primary">
            Timesheet Project
          </Link>
        </div>
        <div>
          <ul className="flex space-x-4 items-center">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.path}
                  className="px-3 py-2 rounded-md transition-colors duration-200 hover:bg-muted hover:text-primary font-medium"
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <li>
              <ThemeToggle />
            </li>
          </ul>
        </div>
      </div>
      
    </nav>
  );
}
