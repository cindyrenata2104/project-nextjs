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
  const [isModalOpen, setModalOpen] = useState(false);
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
      setModalOpen(false);
    } catch (error) {
      console.error("Gagal menambahkan data karyawan", error);
    }
  };



  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Karyawan</h1>
        <button onClick={() => setModalOpen(true)} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium">
          + Tambah Karyawan
        </button>
      </div>
      {/* JIKA isModalOpen true, TAMPILKAN BAGIAN INI: */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">

          {/* KOTAK MODAL PUTIH */}
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Form Tambah Barang</h2>

            <form onSubmit={handleCreate}>
              {/* Input Nama Barang */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Nama Karyawan</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
                <label className="block text-sm font-medium mb-1">Jabatan</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.jabatan} onChange={(e) => setForm({ ...form, jabatan: e.target.value })} />
                <label className="block text-sm font-medium mb-1">Periode</label>
                <input type="text" className="w-full border rounded px-3 py-2"value={form.periode} onChange={(e) => setForm({ ...form, periode: e.target.value })} />
                <label className="block text-sm font-medium mb-1"> Status Kerja</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.status_kerja} onChange={(e) => setForm({ ...form, status_kerja: e.target.value })} />
              </div>

              {/* Tombol Aksi */}
              <div className="flex justify-end gap-2">
                {/* Tombol Batal: Mengubah state kembali ke false untuk menutup pop-up */}
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Batal
                </button>

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                  Simpan
                </button>
              </div>
            </form>
          </div>

        </div>
      )}

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
