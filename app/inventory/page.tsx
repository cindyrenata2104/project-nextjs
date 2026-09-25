"use client";

import React, { useEffect, useState } from 'react';

interface Inventory {
  id: number;
  jenis_barang: string;
  ukuran: string;
  status: string;
};
//interface dropdown jenis barang
interface inventory {
  jenis_barang: string;
}

export default function InventoryPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ jenis_barang: '', ukuran: '', status: 'inventory' });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/inventory');
      const data = await res.json();
      setInventory(data);
    } catch (error) {
      console.error("Failed to fetch inventory", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        // Jika berhasil masuk database:
        setForm({ jenis_barang: '', ukuran: '', status: 'inventory' }); // Reset form
        setModalOpen(false); // Tutup pop up
        fetchInventory(); // Ambil data terbaru agar tampil di tabel
      } else {
        alert("Gagal menambahkan barang ke database.");
      }
    } catch (error) {
      console.error("Failed to create inventory", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus barang ini?')) return;
    try {
      await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
      fetchInventory();
    } catch (error) {
      console.error("Failed to delete inventory", error);
    }
  };
  //FILTERED INVENTORY
  const filteredInventory = inventory.filter((item) => {
    return(
      item.id.toString().includes(search.toString()) ||
      item.jenis_barang.toLowerCase().includes(search.toLowerCase())
    )
  }); 
  return (
    
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Inventory</h1>
        <button
          onClick={() => setModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
          + Tambah Barang
        </button>
        </div>
           {/* INPUT SEARCH */}
       <div>
      <input
        type="text"
        placeholder="Cari berdasarkan ID atau nama..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded-lg px-4 py-2"
      />
    
      
        {/* JIKA isModalOpen true, TAMPILKAN BAGIAN INI: */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">

            {/* KOTAK MODAL PUTIH */}
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">Form Tambah Barang</h2>

              <form onSubmit={handleCreate}>
                {/* Input Nama Barang */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Jenis Barang</label>
                  <select
                    required
                    className="w-full border rounded px-3 py-2 mb-3"
                    value={form.jenis_barang}
                    onChange={(e) => setForm({ ...form, jenis_barang: e.target.value })}
                  >
                    <option value="">-- Pilih Jenis Barang --</option>
                    <option value="seragam">Seragam</option>
                    <option value="sepatu">Sepatu</option>
                  </select>
                  <label className="block text-sm font-medium mb-1">Ukuran</label>
                  <input
                    type="text"
                    required
                    className="w-full border rounded px-3 py-2 mb-3"
                    value={form.ukuran}
                    onChange={(e) => setForm({ ...form, ukuran: e.target.value })}
                  />

                  <label className="block text-sm font-medium mb-1">Status</label>
                  <input
                    type="text"
                    readOnly
                    className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-500"
                    value={form.status}
                  />
                  <label className="block text-sm font-medium mb-1">Status</label>
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

      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600">
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Jenis Barang</th>
                <th className="p-4 font-semibold">Ukuran</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">Memuat data...</td>
                </tr>
              ) : inventory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">Tidak ada data barang.</td>
                </tr> 
              ) : filteredInventory.length === 0 ?(
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">Tidak ada data barang.</td>
                </tr>
              ): (

                filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-600">#{item.id}</td>
                    <td className="p-4 font-medium text-gray-800">{item.jenis_barang}</td>
                    <td className="p-4 text-gray-600">{item.ukuran}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.status === 'inventory' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {item.status === 'inventory' ? 'inventory' : 'Dipinjam'}
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
