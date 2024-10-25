// components/Sidebar.js

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function Sidebar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: session } = useSession();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col fixed">
      <div className="p-4">
        {/* User info */}
        <div className="flex items-center mb-6">
          <div className="bg-gray-600 rounded-full w-12 h-12 flex items-center justify-center mr-3">
            <span className="text-lg">👤</span>
          </div>
          <div className="relative">
            {session && session.user ? (
              <p
                className="text-lg font-semibold cursor-pointer"
                onClick={toggleDropdown}
              >
                {`${session.user.firstName} ${session.user.lastName}`} ▼
              </p>
            ) : (
              <p>Loading...</p> // Handle loading or undefined user session
            )}
            {dropdownOpen && (
              <div className="absolute bg-gray-700 mt-2 rounded shadow-lg w-48">
                <ul>
                  <li>
                    <Link
                      href="/app/account-settings"
                      className="block py-2 px-4 hover:bg-gray-600 rounded"
                    >
                      Account Settings
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/account/login"
                      className="block py-2 px-4 hover:bg-gray-600 rounded"
                    >
                      Log Out
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        {/* Navigation links */}
        <nav className="flex-grow">
          <ul className="space-y-2">
            <li>
              <Link
                href="/app/dashboard"
                className="block py-2 px-4 hover:bg-gray-700 rounded"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/app/employees"
                className="block py-2 px-4 hover:bg-gray-700 rounded"
              >
                Employees
              </Link>
            </li>
            <li>
              <Link
                href="/app/timesheet"
                className="block py-2 px-4 hover:bg-gray-700 rounded"
              >
                Timesheet
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
