"use client"
import {useState} from 'react';
import type { FormEvent } from "react";

export default function SettingPage() {
    const [form, setForm] = useState({
        name: "",
        email:"",
        password:""
    })
    const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch("/api/admin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
        }),
    });

    const data = await response.json();

    alert(data.message);
};
    return (
        <div className="p-8 max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Setting</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Pengaturan sistem dan manajemen akun admin/user
                </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 max-w-xl">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                    Tambah User
                </h2>

                <form onSubmit={handleCreate} noValidate className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nama
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                            placeholder="Masukkan Nama"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                            placeholder="Masukkan Email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                            placeholder="Masukkan Password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition duration-150 text-sm cursor-pointer"
                        >
                            Tambah
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}