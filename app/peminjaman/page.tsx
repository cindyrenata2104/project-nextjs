"use client";

import React, { useEffect, useState } from "react";

interface Peminjaman {
  id: number;
  tanggal_peminjaman: string;

  karyawan: {
    nama: string;
    jabatan: string;
  };

  inventory: {
    jenis_barang: string;
  };

  Pengembalian: {
    id: number;
    tanggal_pengembalian: string;
  } | null;
}

export default function PeminjamanPage() {
  const [dataPeminjaman, setDataPeminjaman] = useState<Peminjaman[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPeminjaman = async () => {
      try {
        const response = await fetch("/api/peminjaman");

        if (!response.ok) {
          throw new Error("Gagal mengambil data peminjaman");
        }

        const data = await response.json();

        setDataPeminjaman(data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPeminjaman();
  }, []);

  if (loading) {
    return <p className="p-5">Memuat data...</p>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Data Peminjaman Barang
        </h1>

        <button
          onClick={() => (true)}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium"
        >
          + Tambah Peminjaman
        </button>
        
      </div>
      

      {/* TABLE */}
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">
              ID Peminjaman
            </th>

            <th className="border border-gray-300 px-4 py-2 text-left">
              Nama Peminjam (Karyawan)
            </th>

            <th className="border border-gray-300 px-4 py-2 text-left">
              Jabatan
            </th>

            <th className="border border-gray-300 px-4 py-2 text-left">
              Jenis Barang
            </th>

            <th className="border border-gray-300 px-4 py-2 text-left">
              Tanggal Pinjam
            </th>
          </tr>
        </thead>

        <tbody>
          {dataPeminjaman.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">

              {/* ID Peminjaman */}
              <td className="border border-gray-300 px-4 py-2">
                {item.id}
              </td>

              {/* Nama Karyawan */}
              <td className="border border-gray-300 px-4 py-2">
                {item.karyawan
                  ? item.karyawan.nama
                  : "Tidak ada data"}
              </td>

              {/* Jabatan */}
              <td className="border border-gray-300 px-4 py-2">
                {item.karyawan
                  ? item.karyawan.jabatan
                  : "-"}
              </td>

              {/* Jenis Barang */}
              <td className="border border-gray-300 px-4 py-2">
                {item.inventory
                  ? item.inventory.jenis_barang
                  : "Barang tidak ditemukan"}
              </td>

              {/* Tanggal Peminjaman */}
              <td className="border border-gray-300 px-4 py-2">
                {new Date(
                  item.tanggal_peminjaman
                ).toLocaleDateString("id-ID")}
              </td>

            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}