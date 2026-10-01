'use client';

import React, { useEffect, useState } from 'react';
interface Riwayat {
  id: number;
  id_karyawan: number | null;
  nama_karyawan: string | null;
  id_barang: number | null;
  jenis_barang: string | null;
  jenis: string;
  aktivitas: string;
  keterangan: string;
  tanggal: string;
}

export default function RiwayatPage() {
  // 1. Menyimpan data riwayat
  const [riwayat, setRiwayat] = useState<Riwayat[]>([]);

  useEffect(() => { 
      fetchRiwayat();
    }, []);

  // 2. Fungsi untuk mengambil data dari API
  const fetchRiwayat = async () => {
    try {
      const res = await fetch('/api/riwayat');

      const data = await res.json();

      setRiwayat(data);
    } catch (error) {
      console.error('Gagal menampilkan data Riwayat:', error);
    }
  };

  // MAP
  

  // 4. Tampilan halaman
  return ( 
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Riwayat</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-700">
                <th className="p-4 font-semibold border-r border-gray-200 whitespace-nowrap">ID Karyawan</th>
                <th className="p-4 font-semibold border-r border-gray-200 whitespace-nowrap">ID Barang</th>
                <th className="p-4 font-semibold border-r border-gray-200 whitespace-nowrap">Jenis</th>
                <th className="p-4 font-semibold border-r border-gray-200 whitespace-nowrap">Jenis Barang</th>
                <th className="p-4 font-semibold border-r border-gray-200">Aktivitas</th>
                <th className="p-4 font-semibold border-r border-gray-200">Keterangan</th>
                <th className="p-4 font-semibold whitespace-nowrap">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {riwayat.map((item) => {
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 border-r border-gray-200 text-gray-700 text-center">{item.id_karyawan || '-'}</td>
                    <td className="p-4 border-r border-gray-200 text-gray-700 text-center">{item.id_barang || '-'}</td>
                    <td className="p-4 border-r border-gray-200 text-gray-700 font-medium">{item.jenis}</td>
                    <td className="p-4 border-r border-gray-200 text-gray-700">{item.jenis_barang || '-'}</td>
                    <td className="p-4 border-r border-gray-200 text-gray-700 min-w-[250px]">{item.aktivitas}</td>
                    <td className="p-4 border-r border-gray-200 text-gray-700 min-w-[250px]">{item.keterangan}</td>
                    <td className="p-4 text-gray-700 whitespace-nowrap">
                      {new Date(item.tanggal).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}