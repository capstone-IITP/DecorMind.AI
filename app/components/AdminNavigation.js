"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNavigation() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin" },
    { name: "Auth Test", href: "/admin-auth-test" },
    { name: "Debug", href: "/admin-debug" },
    { name: "Setup", href: "/admin-setup" },
  ];

  return (
    <nav className="bg-gray-800 text-white p-4 rounded-lg mb-8">
      <ul className="flex space-x-4">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === item.href
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
} 