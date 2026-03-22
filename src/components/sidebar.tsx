'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAVIGATION = [
  { name: 'Dashboard', href: '/', icon: '📊' },
  { name: 'Leasing', href: '/leasing', icon: '🔑' },
  { name: 'Maintenance', href: '/maintenance', icon: '🔧' },
  { name: 'Inspections', href: '/inspections', icon: '👀' },
  { name: 'Unit Turns', href: '/unit-turns', icon: '🏠' },
  { name: 'Notices', href: '/notices', icon: '📋' },
  { name: 'Capital Projects', href: '/capital-projects', icon: '🏗️' },
  { name: 'Comp Watch', href: '/comp-watch', icon: '🔭' },
  { name: 'Vendors', href: '/vendors', icon: '🤝' },
  { name: 'Reports', href: '/reports', icon: '📈' },
  { name: 'Marketing', href: '/marketing', icon: '📱' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold">Moxie PM</h1>
        <p className="text-sm text-slate-400 mt-1">Property Management</p>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {NAVIGATION.map(item => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
