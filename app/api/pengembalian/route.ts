import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const data = await prisma.pengembalian.findMany({
      include: {
        peminjaman: {
          include: {
            karyawan: true,
            inventory: true,
          }
        }
      }
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error GET pengembalian:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data pengembalian" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { peminjaman_id, tanggal_pengembalian } = body;

    if (!peminjaman_id || !tanggal_pengembalian) {
      return NextResponse.json(
        { error: "peminjaman_id dan tanggal_pengembalian harus diisi" },
        { status: 400 }
      );
    }

    // Buat data pengembalian baru
    const newPengembalian = await prisma.pengembalian.create({
      data: {
        peminjaman_id: parseInt(peminjaman_id, 10),
        tanggal_pengembalian: new Date(tanggal_pengembalian),
      }
    });

    // Cari peminjaman untuk mengetahui inventory_id
    const peminjaman = await prisma.peminjaman.findUnique({
      where: { id: parseInt(peminjaman_id, 10) }
    });

    if (peminjaman) {
      // Update status inventory menjadi "inventory" kembali
      await prisma.inventory.update({
        where: { id: peminjaman.inventory_id },
        data: { status: "inventory" },
      });
    }

    return NextResponse.json(newPengembalian, { status: 201 });
  } catch (error) {
    console.error("Error POST pengembalian:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses pengembalian" },
      { status: 500 }
    );
  }
}
