"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { spacesApi } from '@/lib/api';

interface SpaceItem { id: string; name: string; }

export default function Sidebar() {
  const [spaces, setSpaces] = useState<SpaceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await spacesApi.getAll();
        setSpaces(res.data || []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <aside className="w-64 border-r bg-white/80 backdrop-blur">
      <div className="p-3">
        <h2 className="text-xs font-semibold text-gray-500">Spaces</h2>
        <div className="mt-2 space-y-1">
          {loading && <div className="text-sm text-gray-500">Loading...</div>}
          {!loading && spaces.length === 0 && (
            <div className="text-sm text-gray-500">No spaces yet</div>
          )}
          {spaces.map((s) => (
            <Link key={s.id} href={`/spaces/${s.id}`} className="block px-2 py-1.5 rounded hover:bg-gray-100">
              {s.name}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
