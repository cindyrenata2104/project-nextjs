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
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingDropdown, setLoadingDropdown] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    karyawan_id: '',
    inventory_id: '',
    tanggal_peminjaman: '',
  });

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
         setLoading(true);
         await new Promise((resolve) => setTimeout(resolve, 600));
      const response = await fetch("/api/peminjaman");
      if (!response.ok) {
        const errorData = await response.json();
        setGlobalError(errorData.error);
        return;
      }
      const data = await response.json();
      setGlobalError('');
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
        setLoadingDropdown(true);
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
            const availableInventory = allInventory.filter((item: Inventory) => item.status === "tersedia");
            setInventoryList(availableInventory);
          }
        } catch (error) {
          console.error("Gagal mengambil data dropdown", error);
        } finally {
          setLoadingDropdown(false);
        }
      };

      fetchDropdownData();
    }
  }, [isModalOpen]);

  // --- HANDLER SUBMIT FORM ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const Errors: {
      karyawan_id: string;
      inventory_id: string;
      tanggal_peminjaman: string;
    } = {
      karyawan_id: '',
      inventory_id: '',
      tanggal_peminjaman: '',
    };

    if (!formData.karyawan_id.trim()) {
      Errors.karyawan_id = 'Karyawan wajib diisi';
    }

    if (!formData.inventory_id.trim()) {
      Errors.inventory_id = 'Inventory wajib diisi';
    }

    if (!formData.tanggal_peminjaman.trim()) {
      Errors.tanggal_peminjaman = 'Tanggal peminjaman wajib diisi';
    }

    setFieldErrors(Errors);

    if (Object.values(Errors).some((error) => error !== '')) {
      return;
    }
    try {
      setIsLoadingSubmit(true);
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
        setGlobalError('');
        // Jika sukses, tutup modal, reset form, dan ambil data ulang agar tabel terupdate
        setIsModalOpen(false);
        setGlobalError('');
        setFormData({ karyawan_id: "", inventory_id: "", tanggal_peminjaman: "" });
        fetchPeminjaman();
      } else {
        const errorData = await response.json();
        setFormError(errorData.error);
        alert("Gagal menambahkan peminjaman");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  // filter
  const filteredData = dataPeminjaman.filter((item) => {
    return (
      item.id.toString().includes(search.toString()) ||
      item.karyawan.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.inventory?.jenis_barang.toLowerCase().includes(search.toLowerCase())

    )
  }

  )

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 relative">
      {globalError && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
          {globalError}
        </div>
      )}

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

      {/* INPUT SEARCH */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari berdasarkan ID, nama karyawan, atau barang..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg px-4 py-2"
        />
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
          {loading ? (
            <tr>
              <td colSpan={7} className="border border-gray-300 p-8 text-center text-gray-500">
                Memperbarui data...
              </td>
            </tr>
          ) : filteredData.length === 0 ? (
            <tr>
              <td colSpan={7} className="border border-gray-300 p-8 text-center text-gray-500">
                Tidak ada data peminjaman.
              </td>
            </tr>
          ) : (
            filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                <td className="border border-gray-300 px-4 py-2">{item.inventory.id}</td>
                <td className="border border-gray-300 px-4 py-2">{item.karyawan.id}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.karyawan ? item.karyawan.nama : "Tidak ada data"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.karyawan ? item.karyawan.jabatan : "-"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.inventory ? item.inventory.jenis_barang : "Barang tidak ditemukan"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(item.tanggal_peminjaman).toLocaleDateString("id-ID")}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* --- POP-UP MODAL FORM --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 transition-all duration-300 scale-100 opacity-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Tambah Peminjaman</h2>
            {formError && (
              <div className="text-red-600 mb-4 font-semibold">{formError}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* DROPDOWN KARYAWAN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Karyawan</label>
                <select

                  value={formData.karyawan_id}
                  disabled={loadingDropdown}
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
                {fieldErrors.karyawan_id && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.karyawan_id}</p>
                )}
              </div>

              {/* DROPDOWN INVENTORY / JENIS BARANG */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Barang Tersedia</label>
                <select

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
                {fieldErrors.inventory_id && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.inventory_id}</p>
                )}
              </div>

              {/* INPUT TANGGAL PEMINJAMAN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Peminjaman</label>
                <input
                  type="date"

                  value={formData.tanggal_peminjaman}
                  onChange={(e) => setFormData({ ...formData, tanggal_peminjaman: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
                />
                {fieldErrors.tanggal_peminjaman && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.tanggal_peminjaman}</p>
                )}
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
                  disabled={isLoadingSubmit}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                 {isLoadingSubmit?"Memuat data...":"Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
