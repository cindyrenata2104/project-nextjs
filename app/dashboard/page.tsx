"use client";

import React, { useEffect, useState } from 'react';
import DashboardCard from '../component/dashboardcard';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    karyawan: 0,
    inventory: 0,
    peminjaman: 0,
    pengembalian: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [karyawanRes, inventoryRes, peminjamanRes, pengembalianRes] = await Promise.all([
          fetch('/api/karyawan'),
          fetch('/api/inventory'),
          fetch('/api/peminjaman'),
          fetch('/api/pengembalian')
        ]);

        const karyawan = await karyawanRes.json();
        const inventory = await inventoryRes.json();
        const peminjaman = await peminjamanRes.json();
        const pengembalian = await pengembalianRes.json();

        setStats({
          karyawan: karyawan.length || 0,
          inventory: inventory.length || 0,
          peminjaman: peminjaman.length || 0,
          pengembalian: pengembalian.length || 0
        });
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mt-1">Ringkasan Sistem Inventaris</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Total Karyawan"
            value={stats.karyawan}
            color="bg-blue-600"
          />
          <DashboardCard
            title="Total Barang"
            value={stats.inventory}
            color="bg-emerald-500"
          />
          <DashboardCard
            title="Total Peminjaman"
            value={stats.peminjaman}
            color="bg-amber-500"
          />
          <DashboardCard
            title="Total Pengembalian"
            value={stats.pengembalian}
            color="bg-indigo-500"
          />
        </div>
      )}
    </div>
  );
}
