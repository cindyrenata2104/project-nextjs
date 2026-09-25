"use client";

import React, { useEffect, useState } from "react";

// --- INTERFACES ---
interface Peminjaman {
  id: number;
  tanggal_peminjaman: string;

  karyawan: {
    id: number;
    nama: string;
    jabatan: string;
  };

  inventory: {
    id: number;
    jenis_barang: string;
  };

  Pengembalian: {
    id: number;
    tanggal_pengembalian: string;
  } | null;
}

// Interface untuk data Dropdown
interface Karyawan {
  id: number;
  nama: string;
}

interface Inventory {
  id: number;
  jenis_barang: string;
  ukuran: string;
  status: string;
}

export default function PeminjamanPage() {
  const [dataPeminjaman, setDataPeminjaman] = useState<Peminjaman[]>([]);
  const [loading, setLoading] = useState(true);

  // --- STATE UNTUK MODAL & DROPDOWN ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [karyawanList, setKaryawanList] = useState<Karyawan[]>([]);
  const [inventoryList, setInventoryList] = useState<Inventory[]>([]);
  const [formData, setFormData] = useState({
    karyawan_id: "",
    inventory_id: "",
    tanggal_peminjaman: "",
  });

  // --- MENGAMBIL DATA PEMINJAMAN UTAMA ---
  const fetchPeminjaman = async () => {
    try {
      const response = await fetch("/api/peminjaman");
      if (!response.ok) throw new Error("Gagal mengambil data peminjaman");
      const data = await response.json();
      setDataPeminjaman(data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeminjaman();
  }, []);

  // --- MENGAMBIL DATA DROPDOWN SAAT MODAL DIBUKA ---
  useEffect(() => {
    if (isModalOpen) {
      const fetchDropdownData = async () => {
        try {
          // Ambil data karyawan
          const resKaryawan = await fetch("/api/karyawan");
          if (resKaryawan.ok) {
            setKaryawanList(await resKaryawan.json());
          }

          // Ambil data inventory (barang)
          const resInventory = await fetch("/api/inventory");
          if (resInventory.ok) {
            const allInventory = await resInventory.json();
            // Filter agar HANYA barang yang berstatus "inventory" (belum dipinjam) yang muncul di dropdown
            const availableInventory = allInventory.filter((item: Inventory) => item.status === "inventory");
            setInventoryList(availableInventory);
          }
        } catch (error) {
          console.error("Gagal mengambil data dropdown", error);
        }
      };

      fetchDropdownData();
    }
  }, [isModalOpen]);

  // --- HANDLER SUBMIT FORM ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/peminjaman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          karyawan_id: Number(formData.karyawan_id),
          inventory_id: Number(formData.inventory_id),
          tanggal_peminjaman: formData.tanggal_peminjaman,
        }),
      });

      if (response.ok) {
        // Jika sukses, tutup modal, reset form, dan ambil data ulang agar tabel terupdate
        setIsModalOpen(false);
        setFormData({ karyawan_id: "", inventory_id: "", tanggal_peminjaman: "" });
        fetchPeminjaman();
      } else {
        alert("Gagal menambahkan peminjaman");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) {
    return <p className="p-5">Memuat data...</p>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 relative">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Data Peminjaman Barang</h1>
        {/* Tombol pemicu Pop-Up */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium"
        >
          + Tambah Peminjaman
        </button>
      </div>
      

      {/* TABLE (Sama seperti sebelumnya) */}
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">ID Peminjaman</th>
            <th className="border border-gray-300 px-4 py-2 text-left">ID Barang</th>
            <th className="border border-gray-300 px-4 py-2 text-left">ID Karyawan</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Nama Peminjam</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Jabatan</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Jenis Barang</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Tanggal Pinjam</th>
          </tr>
        </thead>
        <tbody>
          {dataPeminjaman.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{item.id}</td>
              <td className="border border-gray-300 px-4 py-2">{item.inventory.id}</td>
              <td className="border border-gray-300 px-4 py-2">{item.karyawan.id}</td>
              <td className="border border-gray-300 px-4 py-2">{item.karyawan ? item.karyawan.nama : "Tidak ada data"}</td>
              <td className="border border-gray-300 px-4 py-2">{item.karyawan ? item.karyawan.jabatan : "-"}</td>
              <td className="border border-gray-300 px-4 py-2">{item.inventory ? item.inventory.jenis_barang : "Barang tidak ditemukan"}</td>
              <td className="border border-gray-300 px-4 py-2">{new Date(item.tanggal_peminjaman).toLocaleDateString("id-ID")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- POP-UP MODAL FORM --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Tambah Peminjaman</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* DROPDOWN KARYAWAN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Karyawan</label>
                <select
                  required
                  value={formData.karyawan_id}
                  onChange={(e) => setFormData({ ...formData, karyawan_id: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>-- Pilih Karyawan --</option>
                  {karyawanList.map((karyawan) => (
                    <option key={karyawan.id} value={karyawan.id}>
                      {karyawan.nama}
                    </option>
                  ))}
                </select>
              </div>

              {/* DROPDOWN INVENTORY / JENIS BARANG */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Barang Tersedia</label>
                <select
                  required
                  value={formData.inventory_id}
                  onChange={(e) => setFormData({ ...formData, inventory_id: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>-- Pilih Barang --</option>
                  {inventoryList.map((barang) => (
                    <option key={barang.id} value={barang.id}>
                      {barang.jenis_barang} (Ukuran: {barang.ukuran})
                    </option>
                  ))}
                </select>
              </div>

              {/* INPUT TANGGAL PEMINJAMAN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Peminjaman</label>
                <input
                  type="date"
                  required
                  value={formData.tanggal_peminjaman}
                  onChange={(e) => setFormData({ ...formData, tanggal_peminjaman: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
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
