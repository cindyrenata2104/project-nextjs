"use client";

import React, { useEffect, useState } from 'react';

interface Karyawan {
  id: number;
  nama: string;
  jabatan: string;
  periode: string;
  status_kerja: string;
};

export default function KaryawanPage() {
  const [karyawans, setKaryawans] = useState<Karyawan[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nama: '', jabatan: '', periode: '', status_kerja: 'active' });

  useEffect(() => {
    fetchKaryawan();
  }, []);

  const fetchKaryawan = async () => {
    try {
      const res = await fetch('/api/karyawan');
      const data = await res.json();
      setKaryawans(data);
    } catch (error) {
      console.error("Failed to fetch karyawan", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/karyawan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      setForm({ nama: '', jabatan: '', periode: '', status_kerja: 'active' });
      fetchKaryawan();
    } catch (error) {
      console.error("Failed to create karyawan", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus data karyawan ini?')) return;
    try {
      await fetch(`/api/karyawan/${id}`, { method: 'DELETE' });
      fetchKaryawan();
    } catch (error) {
      console.error("Failed to delete karyawan", error);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Karyawan</h1>
        <button disabled className="bg-blue-600 text-white opacity-50 px-6 py-2.5 rounded-lg font-medium cursor-not-allowed">
          + Tambah Karyawan
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600">
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Nama</th>
                <th className="p-4 font-semibold">Jabatan</th>
                <th className="p-4 font-semibold">Periode</th>
                <th className="p-4 font-semibold">Status Kerja</th>
                <th className="p-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">Memuat data...</td>
                </tr>
              ) : karyawans.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">Tidak ada data karyawan.</td>
                </tr>
              ) : (
                karyawans.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-600">#{item.id}</td>
                    <td className="p-4 font-medium text-gray-800">{item.nama}</td>
                    <td className="p-4 text-gray-600">{item.jabatan}</td>
                    <td className="p-4 text-gray-600">{item.periode}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.status_kerja === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {item.status_kerja === 'active' ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
