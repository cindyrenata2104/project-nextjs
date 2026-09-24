"use client";

import React, { useEffect, useState } from "react";

interface Pengembalian {
  id: number;
  peminjaman_id: number;
  tanggal_pengembalian: string;
  peminjaman : {
    id: number;
    karyawan: {
        id: number;
        nama: string;
        jabatan: string;
    }
    inventory: {
        jenis_barang: string;
        ukuran: string;
    }
  };
};

interface Karyawan {
  id: number;
  nama: string;
}

export default function PengembalianPage() {
  const [dataPengembalian, setDataPengembalian] = useState<Pengembalian[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setModalOpen] = useState(false);
  const [karyawanList, setKaryawanList] = useState<Karyawan[]>([]);
  
  // State untuk menampung riwayat peminjaman (yang belum dikembalikan)
  const [peminjamanAktif, setPeminjamanAktif] = useState<any[]>([]);
  
  // State untuk menampung daftar barang (peminjaman) spesifik untuk Karyawan yang dipilih
  const [barangDipinjam, setBarangDipinjam] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
      karyawan_id: "",
      peminjaman_id: "", // Dulu pakai inventory_id, sekarang langsung pakai peminjaman_id
      tanggal_pengembalian: "",
  });

  const fetchPengembalian = async () => {
    try {
      const response = await fetch('/api/pengembalian');
      const data = await response.json();
      setDataPengembalian(data);
    } catch (error) {
      console.error("Gagal mengambil data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPengembalian();
  }, []);

  // --- MENGAMBIL DATA DROPDOWN SAAT MODAL DIBUKA ---
  useEffect(() => {
    if (isModalOpen) {
      const fetchDropdownData = async () => {
        try {
          // 1. Ambil data karyawan
          const resKaryawan = await fetch("/api/karyawan");
          if (resKaryawan.ok) setKaryawanList(await resKaryawan.json());

          // 2. Ambil data peminjaman aktif
          const resPeminjaman = await fetch("/api/peminjaman");
          if (resPeminjaman.ok) {
             const dataPeminjaman = await resPeminjaman.json();
             // Saring hanya yang belum dikembalikan
             setPeminjamanAktif(dataPeminjaman.filter((p: any) => !p.Pengembalian));
          }
        } catch (error) {
          console.error("Gagal mengambil data dropdown", error);
        }
      };

      fetchDropdownData();
    }
  }, [isModalOpen]);

  // --- FILTER BARANG YANG DIPINJAM SETIAP KALI KARYAWAN DIPILIH ---
  useEffect(() => {
    if (formData.karyawan_id && peminjamanAktif.length > 0) {
      const filteredPeminjaman = peminjamanAktif.filter(
        (p) => p.karyawan_id === Number(formData.karyawan_id)
      );
      setBarangDipinjam(filteredPeminjaman);
      // Reset pilihan barang jika karyawannya diganti
      setFormData((prev) => ({ ...prev, peminjaman_id: "" }));
    } else {
      setBarangDipinjam([]);
    }
  }, [formData.karyawan_id, peminjamanAktif]);

  // --- HANDLER SUBMIT FORM ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.peminjaman_id) {
      alert("Silakan pilih barang yang akan dikembalikan.");
      return;
    }

    try {
      const response = await fetch("/api/pengembalian", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          peminjaman_id: formData.peminjaman_id,
          tanggal_pengembalian: formData.tanggal_pengembalian,
        }),
      });

      if (response.ok) {
        setModalOpen(false);
        setFormData({ karyawan_id: "", peminjaman_id: "", tanggal_pengembalian: "" });
        fetchPengembalian();
      } else {
        alert("Gagal menambahkan data pengembalian");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
     <div className="p-8 max-w-6xl mx-auto space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Data Pengembalian Barang
        </h1>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium"
        >
          + Tambah Pengembalian
        </button>
        
      </div>
      
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">ID Pengembalian</th>
            <th className="border border-gray-300 px-4 py-2 text-left">ID Peminjaman</th>
            <th className="border border-gray-300 px-4 py-2 text-left">ID Karyawan</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Nama Peminjam (Karyawan)</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Jabatan</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Jenis Barang</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Tanggal Pengembalian</th>
          </tr>
        </thead>
        <tbody>
          {dataPengembalian.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{item.id}</td>
              
              <td className="border border-gray-300 px-4 py-2">
                {item.peminjaman?.id ? item.peminjaman.id : "Tidak ada data"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {item.peminjaman?.karyawan?.id ? item.peminjaman.karyawan.id : "Tidak ada data"}
              </td>
               <td className="border border-gray-300 px-4 py-2">
                {item.peminjaman?.karyawan?.nama ? item.peminjaman.karyawan.nama : "Tidak ada data"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {item.peminjaman?.karyawan?.jabatan ? item.peminjaman.karyawan.jabatan : "-"}
              </td>
              
              <td className="border border-gray-300 px-4 py-2">
                {item.peminjaman?.inventory?.jenis_barang ? item.peminjaman.inventory.jenis_barang : "Barang tidak ditemukan"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(item.tanggal_pengembalian).toLocaleDateString('id-ID')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL TAMBAH PENGEMBALIAN */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Tambah Pengembalian</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Dropdown Karyawan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Karyawan (Peminjam)
                </label>
                <select
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={formData.karyawan_id}
                  onChange={(e) => setFormData({ ...formData, karyawan_id: e.target.value })}
                >
                  <option value="">-- Pilih Karyawan --</option>
                  {karyawanList.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.nama}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dropdown Barang (Otomatis filter barang milik Karyawan yang dipilih) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Barang yang Dikembalikan
                </label>
                <select
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 disabled:bg-gray-100"
                  value={formData.peminjaman_id}
                  onChange={(e) => setFormData({ ...formData, peminjaman_id: e.target.value })}
                  disabled={!formData.karyawan_id}
                >
                  <option value="">-- Pilih Barang --</option>
                  {barangDipinjam.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.inventory.jenis_barang} {p.inventory.ukuran ? `(Ukuran: ${p.inventory.ukuran})` : ''} - ID Transaksi: {p.id}
                    </option>
                  ))}
                </select>
                {!formData.karyawan_id && (
                  <p className="text-xs text-gray-500 mt-1">Pilih karyawan terlebih dahulu</p>
                )}
                {formData.karyawan_id && barangDipinjam.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">Karyawan ini tidak sedang meminjam barang apapun.</p>
                )}
              </div>

              {/* Input Tanggal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Pengembalian
                </label>
                <input
                  type="date"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={formData.tanggal_pengembalian}
                  onChange={(e) => setFormData({ ...formData, tanggal_pengembalian: e.target.value })}
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded mr-2"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                  disabled={!formData.karyawan_id || !formData.peminjaman_id}
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
