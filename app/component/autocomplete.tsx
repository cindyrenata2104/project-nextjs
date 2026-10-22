
"use client";

import { useState, useEffect } from "react";

interface JenisBarang {
    id: number;
    jenis_barang: string;
}

interface AutocompleteProps {
    onSelect: (jenisBarang: JenisBarang) => void;
}

export default function Autocomplete({ onSelect }: AutocompleteProps) {
    const [jenisBarang, setJenisBarang] = useState<JenisBarang[]>([]);
    const [search, setSearch] = useState("");
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

    const filteredJenisBarang = jenisBarang.filter((item) =>
        item.jenis_barang.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (item: JenisBarang) => {
        setSearch(item.jenis_barang);
        setIsDropdownOpen(false);
        onSelect(item);
    };

    return (
        <div className="relative w-full">
            <label className="mb-1 block text-sm font-medium">
                Jenis Barang
            </label>

            <input
                type="text"
                placeholder="Cari jenis barang..."
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                className="w-full rounded-md border border-gray-300 p-2 outline-none focus:border-blue-500"
            />

            {isDropdownOpen && search.trim() !== "" && (
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
                            Jenis barang tidak ditemukan.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
