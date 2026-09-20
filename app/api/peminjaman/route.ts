import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const data = await prisma.peminjaman.findMany({
      include: {
        karyawan: true,
        inventory: true,
        Pengembalian: true,
      }
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error GET peminjaman:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data peminjaman" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { karyawan_id, inventory_id, tanggal_peminjaman } = body;

    if (!karyawan_id || !inventory_id || !tanggal_peminjaman) {
      return NextResponse.json(
        { error: "karyawan_id, inventory_id, dan tanggal_peminjaman harus diisi" },
        { status: 400 }
      );
    }

    // Buat data peminjaman baru
    const newPeminjaman = await prisma.peminjaman.create({
      data: {
        karyawan_id: parseInt(karyawan_id, 10),
        inventory_id: parseInt(inventory_id, 10),
        tanggal_peminjaman: new Date(tanggal_peminjaman),
      }
    });

    // Update status inventory menjadi "dipinjam"
    await prisma.inventory.update({
      where: { id: parseInt(inventory_id, 10) },
      data: { status: "dipinjam" },
    });

    return NextResponse.json(newPeminjaman, { status: 201 });
  } catch (error) {
    console.error("Error POST peminjaman:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses peminjaman" },
      { status: 500 }
    );
  }
}
