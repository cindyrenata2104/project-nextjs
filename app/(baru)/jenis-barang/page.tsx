"use client";

import React, { useState, useEffect } from 'react';

interface JenisBarang {
    id: number;
    jenis_barang: string;
}

export default function JenisBarangPage() {
    const [jenisBarang, setJenisBarang] = useState<JenisBarang[]>([]);
    const [isModalOpen, setModalOpen] = useState(false)
    const [form, setForm] = useState({ jenis_barang: '' });


    const fetchJenisBarang = async () => {
        const response = await fetch('/api/jenis-barang');
        const data = await response.json();
        setJenisBarang(data);
    };

    useEffect(() => {
        fetchJenisBarang();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/jenis-barang', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (response.ok) {
                // Jika berhasil masuk database:
                setForm({ jenis_barang: '' }); // Reset form
                setModalOpen(false); // Tutup pop up
                fetchJenisBarang(); // Ambil data terbaru agar tampil di tabel
            }
        } catch (error) {
            console.error("Failed to create jenis barang", error);
        }
    };
    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Manajemen Jenis Barang</h1>
                <button
                    onClick={() => {
                        setModalOpen(true)
                    }}

                    className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                >
                    + Tambah Jenis Barang
                </button>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 flex justify-center items-center z-50">

                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 transition-all duration-300 scale-100 opacity-100">
                        <h2 className="text-xl font-bold mb-4">Form Tambah Barang</h2>

                        <form onSubmit={handleCreate}>
                            {/* Input Nama Barang */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Jenis Barang</label>
                                <input
                                    type="text"
                                    className="w-full border rounded px-3 py-2 mb-3"
                                    value={form.jenis_barang}
                                    onChange={(e) => setForm({ ...form, jenis_barang: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="bg-gray-300 px-4 py-2 rounded"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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