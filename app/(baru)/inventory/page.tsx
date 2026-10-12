"use client";

import React, { useEffect, useState } from 'react';

interface Inventory {
  id: number;
  jenis_barang: string;
  ukuran: string;
  status: string;
};

export default function InventoryPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
      jenis_barang: '',
      ukuran: '' , 
    });
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ jenis_barang: '', ukuran: '', status: 'tersedia' });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
      const res = await fetch('/api/inventory');
      if(!res.ok){
        const errorData = await res.json();
       setGlobalError(errorData.error);
        return; 
      }
      const data = await res.json();
      setGlobalError('');
      setInventory(data);
    } catch (error) {
      console.error("Failed to fetch inventory", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors={
      jenis_barang:'',
      ukuran:'',
    }
    if(!form.jenis_barang.trim()){
      errors.jenis_barang = 'jenis barang wajib diisi';
    } 
    if(!form.ukuran.trim()){
      errors.ukuran ='ukuran wajib diisi';

    }setFieldErrors(errors)
    if (Object.values(errors).some((error) => error !== '')) {
      return;
    }
    try {
      setIsLoadingSubmit(true);
      const response = await fetch('/api/inventory', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (response.ok) { 
        // Jika berhasil masuk database:
        setForm({ jenis_barang: '', ukuran: '', status: 'tersedia' }); // Reset form
        setModalOpen(false); // Tutup pop up
        setGlobalError('');
        fetchInventory(); // Ambil data terbaru agar tampil di tabel
      } else {
        const errorData = await response.json();
        setFormError(errorData.error);
        console.log("Error", errorData.error)
        //alert("Gagal menambahkan barang ke database.");
      } 
    } catch (error) {
      console.error("Failed to create inventory", error);
    } finally{
       setIsLoadingSubmit(false);
    }
  };

  //FILTERED INVENTORY
  const filteredInventory = inventory.filter((item) => {
    return (
      item.id.toString().includes(search.toString()) ||
      item.jenis_barang.toLowerCase().includes(search.toLowerCase())
    )
  });
  return (

    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {globalError && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
          {globalError}
        </div>
      )}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Inventory</h1>
        <button
          onClick={() => {
            setFormError('');
            setGlobalError('');
            setModalOpen(true);
          }} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 flex justify-center items-center z-50">

            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 transition-all duration-300 scale-100 opacity-100">
              <h2 className="text-xl font-bold mb-4">Form Tambah Barang</h2>

              <form onSubmit={handleCreate}>
                {/* Input Nama Barang */}
                <div className="mb-4">
                  {formError && <div className="text-red-600 mb-4 font-semibold">{formError}</div>}
                  <label className="block text-sm font-medium mb-1">Jenis Barang</label>
                  <select
                
                    className="w-full border rounded px-3 py-2 mb-3"
                    value={form.jenis_barang}
                    onChange={(e) => setForm({ ...form, jenis_barang: e.target.value })}
                  >
                    <option value="">-- Pilih Jenis Barang --</option>
                    <option value="seragam">Seragam</option>
                    <option value="sepatu">Sepatu</option>
                  </select>
                  {fieldErrors.jenis_barang && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.jenis_barang}</p>
                    )}
                  <label className="block text-sm font-medium mb-1">Ukuran</label>
                  <input
                    type="text"
                    
                    className="w-full border rounded px-3 py-2 mb-3"
                    value={form.ukuran}
                    onChange={(e) => setForm({ ...form, ukuran: e.target.value })}
                  />
                   {fieldErrors.ukuran && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.ukuran}</p>
                    )}
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <input
                    type="text"
                    readOnly
                    className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-500"
                    value={form.status}
                  />
                  
                </div>


                {/* Tombol Aksi */}
                <div className="flex justify-end gap-2">
                  {/* Tombol Batal: Mengubah state kembali ke false untuk menutup pop-up */}
                  <button
                    type="button"
                    onClick={() => {
                      setFormError('');
                      setModalOpen(false);
                    }}
                    className="bg-gray-300 px-4 py-2 rounded"
                  >
                    Batal
                  </button>

                  <button
  type="submit"
  disabled={isLoadingSubmit}
  className="bg-blue-500 text-white px-4 py-2 rounded"
> 
  {isLoadingSubmit ? "Menyimpan..." : "Simpan"}
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
              ) : filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">Tidak ada data barang.</td>
                </tr>
              ) : (

                filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-600">#{item.id}</td>
                    <td className="p-4 font-medium text-gray-800">{item.jenis_barang}</td>
                    <td className="p-4 text-gray-600">{item.ukuran}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.status === 'tersedia' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {item.status === 'tersedia' ? 'tersedia' : 'Dipinjam'}
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
