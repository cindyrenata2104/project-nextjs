"use client";

import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';


interface Inventory {
  id: number;
  jenis_barang: string;
  ukuran: string;
  status: string;
}
interface Peminjaman {
  id: number;
  tanggal_peminjaman: string;
}
interface Pengembalian {
  id: number;
  tanggal_pengembalian: string;
}

export default function DashboardPage() {
  const [karyawans, setKaryawans] = useState([]);
  const [inventoris, setInventoris] = useState<Inventory[]>([]);
  const [peminjamans, setPeminjamans] = useState<Peminjaman[]>([]);
  const [pengembalians, setPengembalians] = useState<Pengembalian[]>([]);
  const dataGrafik = [
    "januari",
    "februari",
    "maret",
    "april",
    "mei",
    "juni",
    "juli",
    "agustus",
    "september",
    "oktober",
    "november",
    "desember",
  ].map((bulan, index) => {
    const jumlahPeminjaman = peminjamans.filter((item) => {
      const tanggal = new Date(item.tanggal_peminjaman);
      return tanggal.getMonth() === index;
    }).length;
    const jumlahPengembalian = pengembalians.filter((item) => {
      const tanggal = new Date(item.tanggal_pengembalian);
      return tanggal.getMonth() === index;
    }).length;
    return {
      bulan: bulan,
      peminjaman: jumlahPeminjaman,
      pengembalian: jumlahPengembalian,
    }
  }
  )


  // MUNCULIN DATA KARYAWAN
  useEffect(() => {
    const fetchKaryawan = async () => {
      try {
        const response = await fetch("/api/karyawan");

        const data = await response.json();

        setKaryawans(data);
      } catch (error) {
        console.error("Gagal mengambil data karyawan:", error);
      }
    };

    fetchKaryawan();
  }, []);

  //MEMUNCULKAN DATA INVENTORY

  useEffect(() => {
    const fetchInventoris = async () => {
      try {
        const res = await fetch("/api/inventory");
        const data = await res.json();
        setInventoris(data);
      } catch (error) {
        console.error("Gagal menampilkan data inventory", error);
      }
    };
    fetchInventoris();
  }, []);

  // MEMUNCULKAN TOTAL DATA PEMINJAMAN
  useEffect(() => {
    const fetchPeminjamans = async () => {
      try {
        const res = await fetch("/api/peminjaman");
        const data = await res.json();
        setPeminjamans(data);
      } catch (error) {
        console.error("Gagal menampilkan data peminjaman", error);
      }
    };
    fetchPeminjamans();
  }, []);

  //MEMUNCULKAN TOTAL DATA PENGEMBALIAN
  useEffect(() => {

    const fetchPengembalians = async () => {
      try {
        const res = await fetch("/api/pengembalian");
        const data = await res.json();
        setPengembalians(data);
      } catch (error) {
        console.error("Gagal menampilkan total data peminjaman", error);
      }
    }; fetchPengembalians();
  }, []);



  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Ringkasan</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Kartu Informasi 1 */}
        <div className="border border-gray-200 p-6 rounded bg-white">
          <h2 className="text-gray-600 mb-2 text-sm font-medium">Total Karyawan</h2>
          <p className="text-3xl font-semibold">{karyawans.length}</p>
        </div>

        {/* Kartu Informasi 2 */}
        <div className="border border-gray-200 p-6 rounded bg-white">
          <h2 className="text-gray-600 mb-2 text-sm font-medium">Total Barang</h2>
          <p className="text-3xl font-semibold">{inventoris.length}</p>
        </div>

        {/* Kartu Informasi 3 */}
        <div className="border border-gray-200 p-6 rounded bg-white">
          <h2 className="text-gray-600 mb-2 text-sm font-medium">Barang Dipinjam</h2>
          <p className="text-3xl font-semibold">{inventoris.filter(item => item.status === "dipinjam").length}</p>
        </div>
        {/* Kartu Informasi 3 */}
        <div className="border border-gray-200 p-6 rounded bg-white">
          <h2 className="text-gray-600 mb-2 text-sm font-medium">Barang Dikembalikan</h2>
          <p className="text-3xl font-semibold">{pengembalians.length}</p>
        </div>
      </div>
      <div className="mt-8 bg-white border border-gray-200 p-6 rounded">

        {/* 1. LETAKKAN JUDUL DI SINI (Di luar ResponsiveContainer) */}
        <h2 className="text-lg font-bold mb-4">Statistik Peminjaman & Pengembalian</h2>
      </div>
      <div style={{ width: "95%", height: 250 }}>

        <ResponsiveContainer>
          <BarChart data={dataGrafik}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="bulan" />
            <YAxis />
            <Bar dataKey="peminjaman" fill='#00cc40'
            />
            <Bar dataKey="pengembalian" fill='#ff3333'
            />
            <Tooltip />
            <Legend />
          </BarChart>

        </ResponsiveContainer>
      </div>
    </div>
  );
}