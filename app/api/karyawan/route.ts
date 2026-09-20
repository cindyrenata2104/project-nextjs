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
    const { nama, jabatan, periode, status_kerja } = body;

    if (!nama || !jabatan || !periode || !status_kerja) {
      return NextResponse.json(
        { error: "nama, jabatan, periode, dan status_kerja harus diisi" },
        { status: 400 }
      );
    }

    const newKaryawan = await prisma.karyawan.create({
      data: {
        nama,
        jabatan,
        periode,
        status_kerja,
      }
    });

    return NextResponse.json(newKaryawan, { status: 201 });
  } catch (error) {
    console.error("Error POST karyawan:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menambahkan karyawan" },
      { status: 500 }
    );
  }
}
