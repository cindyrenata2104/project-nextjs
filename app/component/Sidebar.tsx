'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Karyawan', href: '/karyawan'},
    { name: 'Inventory', href: '/inventory' },
    { name: 'Peminjaman', href: '/peminjaman' },
    { name: 'Pengembalian', href: '/pengembalian' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col shadow-xl">
      <div className="p-6 flex items-center gap-3">
        <h2 className="text-xl font-bold tracking-tight">Sistem Inventaris</h2>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {links.map((link) => {
          const isActive = pathname === link.href || (pathname === '/' && link.href === '/dashboard');
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              
              <span className="font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-6 text-xs text-slate-500 text-center">
        © 2026 Sistem Inventaris
      </div>
    </aside>
  );
}
