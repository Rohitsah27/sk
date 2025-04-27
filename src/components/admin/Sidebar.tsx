// components/admin/Sidebar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    // { href: '/admin', label: 'Dashboard', icon: '📊' },
    
    { href: '/admin/products', label: 'Products', icon: '🛍️' },
    // { href: '/admin/orders', label: 'Orders', icon: '📦' },
    { href: '/admin/categories', label: 'Categories', icon: '📦' },
    // { href: '/admin/users', label: 'Users', icon: '👥' },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold">S K Equipments</h2>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center p-2 rounded-lg hover:bg-gray-700 ${
                  pathname === item.href ? 'bg-gray-700' : ''
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}