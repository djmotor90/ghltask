import Link from 'next/link';
import { useAuthStore } from '@/store/auth';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-semibold text-gray-900">GHL Task</Link>
            <nav className="hidden md:flex items-center gap-4 text-sm text-gray-600">
              <Link href="/dashboard" className="hover:text-gray-900">Dashboard</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button onClick={logout} className="px-3 py-1.5 text-sm bg-gray-900 text-white rounded-md">Logout</button>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
