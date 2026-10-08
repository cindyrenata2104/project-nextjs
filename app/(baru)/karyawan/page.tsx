"use client";

import React, { useEffect, useState } from 'react';

interface Karyawan {
  id: number;
  nama: string;
  jabatan: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  status_kerja: string;
};

function formatTanggal(tanggal: string) {
  const date = new Date(tanggal);

  const formatter = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return formatter.format(date);
}

export default function KaryawanPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [karyawans, setKaryawans] = useState<Karyawan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditModal, setEditModal] = useState(false);
  const [idKaryawan, setIdKaryawan] = useState<number | null>(null);
  const [isPeriode, setPeriode] = useState({
    tanggal_mulai: '',
    tanggal_selesai: '',
  })
  const [form, setForm] = useState({ nama: '', jabatan: '', tanggal_mulai: '', tanggal_selesai: '', status_kerja: 'active' });
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchKaryawan();
  }, []);

  const fetchKaryawan = async () => {
    try {
      const res = await fetch('/api/karyawan');
      if(!res.ok){
        const errorData = await res.json()
        setError(errorData.error);
        return;
      }
      const data = await res.json();
      setError('');
      setKaryawans(data);
    } catch (error) {
      console.error("Failed to fetch karyawan", error);
      setError("Gagal Menampilkan data karyawan");
    } finally {
      setLoading(false); 
    }
  };

  //HANDLE 

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
    !form.nama ||
    !form.jabatan ||
    !form.tanggal_mulai ||
    !form.tanggal_selesai
  ) {
    setError("Semua data wajib diisi");
    return;
    
  }
    try {
      const response = await fetch('/api/karyawan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error);
        console.error("Error dari API:", errorData);
        return;
      }
      setError('');
      setForm({ nama: '', jabatan: '', tanggal_mulai: '', tanggal_selesai: '', status_kerja: 'active' });
      fetchKaryawan();
      setModalOpen(false);
    } catch (error) {
      console.error("Gagal menambahkan data karyawan", error);
      setError("Gagal menambahkan data karyawan");
    }
  };
  const handleEdit = (item: Karyawan) => {
    console.log("EDIT DIKLIK", item);
    setIdKaryawan(item.id);
    setPeriode({
      tanggal_mulai: item.tanggal_mulai.slice(0,10),
      tanggal_selesai: item.tanggal_selesai.slice(0,10),
    });
    setEditModal(true);
    console.log("modal terbuka");
  }

  const handleSavePeriode = async()=>{
    if (idKaryawan === null) return;
    try{
    const payloadData = {
      tanggal_mulai: new Date(isPeriode.tanggal_mulai).toISOString(),
      tanggal_selesai: new Date(isPeriode.tanggal_selesai).toISOString(),
      info: "periode"
    };
    const response = await fetch(`/api/karyawan/${idKaryawan}`,
      {
      method: "PUT",
      headers: {"content-type": "application/json"},
      body: JSON.stringify(payloadData),
    });
    if(response.ok){
      setError('');
      fetchKaryawan();
      setEditModal(false);

    }else {
  const errorData = await response.json();
  setError(errorData.error);
  console.error("Gagal menyimpan periode:", errorData);
  return;
  }
  } catch (error) {
  setError("Gagal menyimpan periode karyawan");
  console.error("Gagal menyimpan periode:", error);
}
  }

  //TOGGLE STATUS
  const toggleStatus = async (id: number, currentStatus: string) => {
    console.log("Tombol diklik! ID:", id, "Status saat ini:", currentStatus);
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const response = await fetch(`/api/karyawan/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status_kerja: newStatus, info: "status" }),
        });
      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error);
        return;
      }
      setError('');
      fetchKaryawan();
    } catch (error) {
      console.error("Gagal mengubah status karyawan", error);
      setError("Gagal mengubah status karyawan");
    };
  };

  // FILTERING DATA BERDASARKAN SEARCH
  const filteredKaryawans = karyawans.filter((item) => {
    return (
      item.id.toString().includes(search.toString()) ||
      item.nama.toLowerCase().includes(search.toLowerCase())
    )
  });

  return (

    <div className="p-8 max-w-6xl mx-auto space-y-8">
    {error&& (
      <div className="text-red-600">{error}</div>
    )}
      {isEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">

          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">

            <h2 className="text-xl font-bold mb-4">
              Edit Periode Karyawan
            </h2>
            <label className="block text-sm font-medium mb-1">
              Tanggal Mulai
            </label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2"
              value={isPeriode.tanggal_mulai}
              onChange={(e) =>
                setPeriode({
                  ...isPeriode,
                  tanggal_mulai: e.target.value,
                })
              }
            />
            <input
              type="date"
              className="w-full border rounded px-3 py-2"
              value={isPeriode.tanggal_selesai}
              min={isPeriode.tanggal_mulai}
              onChange={(e) =>
                setPeriode({
                  ...isPeriode,
                  tanggal_selesai: e.target.value,
                })
              }
            />
            <div className="flex justify-end gap-2 mt-6">
              <button
              type = "button"
              onClick={()=> setEditModal(false)}
               className="bg-gray-300 px-4 py-2 rounded"
              >Batal
              </button>
              <button
              type="button"
              onClick={handleSavePeriode}
               className="bg-blue-300 px-4 py-2 rounded">
                Simpan
              </button>
              </div>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Karyawan</h1>
       <button
  onClick={() => {
    setError('');
    setModalOpen(true);
  }}
  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium"
>
  + Tambah Karyawan
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
      </div>

      {/* JIKA isModalOpen true, TAMPILKAN BAGIAN INI: */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">

          {/* KOTAK MODAL PUTIH */}
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Form Tambah Barang</h2>

            <form onSubmit={handleCreate}noValidate>
                {error && (
    <div className="text-red-600 mb-4">
      {error}
    </div>
  )}
              {/* Input Nama Barang */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Nama Karyawan</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
                <label className="block text-sm font-medium mb-1">Jabatan</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.jabatan} onChange={(e) => setForm({ ...form, jabatan: e.target.value })} />
                <label className="block text-sm font-medium mb-1">tanggal mulai</label>
                <input type="date" className="w-full border rounded px-3 py-2" value={form.tanggal_mulai} onChange={(e) => setForm({ ...form, tanggal_mulai: e.target.value })} />
                <label className="block text-sm font-medium mb-1">tanggal selesai</label>
                <input type="date" className="w-full border rounded px-3 py-2" value={form.tanggal_selesai} min={form.tanggal_mulai} onChange={(e) => setForm({ ...form, tanggal_selesai: e.target.value })} />
                <label className="block text-sm font-medium mb-1"> Status Kerja</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.status_kerja} onChange={(e) => setForm({ ...form, status_kerja: e.target.value })} />
              </div>

              {/* Tombol Aksi */}
              <div className="flex justify-end gap-2">
                {/* Tombol Batal: Mengubah state kembali ke false untuk menutup pop-up */}
                <button
  type="button"
  onClick={() => {
    setError('');
    setModalOpen(false);
  }}
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
              ) : filteredKaryawans.length === 0 ? (

                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">Tidak ada data karyawan.</td>
                </tr>
              ) :
                filteredKaryawans.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-600">#{item.id}</td>
                    <td className="p-4 font-medium text-gray-800">{item.nama}</td>
                    <td className="p-4 text-gray-600">{item.jabatan}</td>
                    <td className="p-4 text-gray-600">{formatTanggal(item.tanggal_mulai)} - {formatTanggal(item.tanggal_selesai)}
                      <button onClick={() => handleEdit(item)} className=" text-white px-6 py-2.5 rounded-lg font-medium">
                        ✏️</button>
                    </td>
                    <td className="p-4">
                      <button onClick={() => toggleStatus(item.id, item.status_kerja)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${item.status_kerja === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {item.status_kerja === 'active' ? 'active' : 'inactive'}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
