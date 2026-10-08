import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const data = await prisma.karyawan.findMany();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error GET karyawan:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data karyawan" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama, jabatan, tanggal_mulai, tanggal_selesai, status_kerja } = body;

    if (!nama || !jabatan || !tanggal_mulai || !tanggal_selesai || !status_kerja) {
      return NextResponse.json(
        { error: "nama, jabatan, tanggal_mulai, tanggal_selesai, dan status_kerja harus diisi" },
        { status: 400 }
      );
    }

    const newKaryawan = await prisma.karyawan.create({
      data: {
        nama,
        jabatan,
        tanggal_mulai: new Date(tanggal_mulai),
        tanggal_selesai: new Date(tanggal_selesai),
        status_kerja,
      }
    });
    await prisma.riwayat.create({
      data: {
        id_karyawan: newKaryawan.id,
        nama_karyawan: newKaryawan.nama,
        jenis: "Karyawan",
        aktivitas: "Menambah karyawan baru",
        keterangan: `Karyawan baru ${newKaryawan.nama} dengan jabatan ${newKaryawan.jabatan} telah ditambahkan`,
      }
    })

    return NextResponse.json(newKaryawan, { status: 201 });
  } catch (error) {
    console.error("Error POST karyawan:", error);
    console.error("Detail error:", JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menambahkan karyawan" },
      { status: 500 }
    );
  }
}
