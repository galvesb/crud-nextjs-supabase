"use client";

import { useEffect, useState } from 'react';
import { cacheService } from '@/services/cacheService';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
  });

  useEffect(() => {
    async function loadStats() {
      const cachedCount = await cacheService.getTotalCount();
      if (cachedCount > 0) {
        setStats({ total: cachedCount });
      } else {
        await cacheService.fetchAndUpdateCache();
        const freshCount = await cacheService.getTotalCount();
        setStats({ total: freshCount });
      }
    }

    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-black">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-medium mb-2">Total de Pessoas</h3>
            <p className="text-3xl font-bold">{stats.total}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
