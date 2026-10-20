"use client";

import React, { useState, useEffect } from 'react';

interface JenisBarang {
    id: number;
    jenis_barang: string;
}

export default function JenisBarangPage() {
    const [jenisBarang, setJenisBarang] = useState<JenisBarang[]>([]);
    const [isModalOpen, setModalOpen] = useState(false)

    useEffect(() => {
        const fetchJenisBarang = async () => {
            const response = await fetch('/api/jenis-barang')
            const data = await response.json();
            setJenisBarang(data);
        }
        fetchJenisBarang();
    }, []);
    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Manajemen Jenis Barang</h1>
                <button
                    onClick={() => { }}
                    className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                >
                    + Tambah Jenis Barang
                </button>
            </div>

            {/* Tabel Jenis Barang */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-600">
                                <th className="p-4 font-semibold w-24">ID</th>
                                <th className="p-4 font-semibold">Jenis Barang</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {jenisBarang.length === 0 ? (
                                <tr>
                                    <td colSpan={2} className="p-8 text-center text-gray-500">
                                        Tidak ada data jenis barang.
                                    </td>
                                </tr>
                            ) : (
                                jenisBarang.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-gray-600">#{item.id}</td>
                                        <td className="p-4 font-medium text-gray-800">{item.jenis_barang}</td>
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