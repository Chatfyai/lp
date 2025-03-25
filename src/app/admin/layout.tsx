import { StoreProvider } from '@/context/StoreContext';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <div className="flex min-h-screen">
        <div className="w-64 bg-gray-800 text-white p-4">
          <h1 className="text-xl font-bold mb-6">Naturalys - Admin</h1>
          <nav>
            <ul className="space-y-2">
              <li>
                <Link href="/admin" className="block py-2 px-4 hover:bg-gray-700 rounded">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin/settings" className="block py-2 px-4 hover:bg-gray-700 rounded">
                  Configurações
                </Link>
              </li>
              <li>
                <Link href="/" className="block py-2 px-4 hover:bg-gray-700 rounded">
                  Ver Site
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex-1 p-8">
          {children}
        </div>
      </div>
    </StoreProvider>
  );
} 