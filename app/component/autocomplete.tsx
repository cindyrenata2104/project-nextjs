
"use client";

import { useState, useEffect } from "react";

interface JenisBarang {
    id: number;
    jenis_barang: string;
}

interface AutocompleteProps {
    value: string;
    onChange: (jenisBarang: string) => void;
}

export default function Autocomplete({ value, onChange }: AutocompleteProps) {
    const [jenisBarang, setJenisBarang] = useState<JenisBarang[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchJenisBarang = async () => {
            try {
                const response = await fetch("/api/jenis-barang");

                if (!response.ok) {
                    throw new Error("Gagal mengambil jenis barang");
                }

                const data: JenisBarang[] = await response.json();
                setJenisBarang(data);
            } catch (error) {
                console.error("Error mengambil jenis barang:", error);
            }
        };

        fetchJenisBarang();
    }, []);

    const search = value.trim().toLowerCase();
    const filteredJenisBarang = search
        ? jenisBarang.filter((item) =>
              item.jenis_barang.toLowerCase().includes(search)
          )
        : jenisBarang;

    const handleSelect = (item: JenisBarang) => {
        onChange(item.jenis_barang);
        setIsDropdownOpen(false);
    };

    return (
        <div
            className="relative w-full"
            onBlur={(event) => {
                if (
                    !(event.relatedTarget instanceof Node) ||
                    !event.currentTarget.contains(event.relatedTarget)
                ) {
                    setIsDropdownOpen(false);
                }
            }}
        >
            <label className="mb-1 block text-sm font-medium">
                Jenis Barang
            </label>

            <input
                type="text"
                placeholder="Cari jenis barang..."
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                className="w-full rounded-md border border-gray-300 p-2 outline-none focus:border-blue-500"
            />

            {isDropdownOpen && (
                <div className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-md">
                    {filteredJenisBarang.length > 0 ? (
                        filteredJenisBarang.map((item) => (
                            <button
                                type="button"
                                key={item.id}
                                onClick={() => handleSelect(item)}
                                className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                            >
                                {item.jenis_barang}
                            </button>
                        ))
                    ) : (
                        <p className="p-3 text-sm text-gray-500">
                            {search
                                ? "Tidak ada pilihan yang cocok. Jenis yang diketik tetap bisa disimpan."
                                : "Belum ada jenis barang terdaftar."}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
