"use client";

import React, { useEffect, useState } from "react";

// 1. Definisikan tipe data sesuai dengan hasil JOIN dari Prisma
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
    }
  };
  
};

export default function PengembalianPage() {
  const [dataPengembalian, setDataPengembalian] = useState<Pengembalian[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2. Memanggil API yang sudah memuat query JOIN (include)
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

    fetchPengembalian();
  }, []);

  if (loading) return <p className="p-5">Memuat data...</p>;

  return (
     <div className="p-8 max-w-6xl mx-auto space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Data Pengembalian Barang
        </h1>

        <button
          onClick={() => (true)}
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
              
              {/* 3. CARA MENAMPILKAN DATA HASIL JOIN */}
              {/* Memanggil data dari tabel karyawan */}
              <td className="border border-gray-300 px-4 py-2">
                {item.peminjaman.id ? item.peminjaman.id: "Tidak ada data"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {item.peminjaman.id ? item.peminjaman.karyawan.id: "Tidak ada data"}
              </td>
               <td className="border border-gray-300 px-4 py-2">
                {item.peminjaman.id ? item.peminjaman.karyawan.nama : "Tidak ada data"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {item.peminjaman.id ? item.peminjaman.karyawan.jabatan : "-"}
              </td>
              
              {/* Memanggil data dari tabel inventory */}
              <td className="border border-gray-300 px-4 py-2">
                {item.peminjaman.id ? item.peminjaman.inventory.jenis_barang : "Barang tidak ditemukan"}
              </td>
              {/* Tanggal biasa */}
              <td className="border border-gray-300 px-4 py-2">
                {new Date(item.tanggal_pengembalian).toLocaleDateString('id-ID')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
