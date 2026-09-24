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

    // 1. Ambil data dari body
    const {
      karyawan_id,
      inventory_id,
      tanggal_peminjaman
    } = body;

    // 2. Validasi
    if (!karyawan_id || !inventory_id || !tanggal_peminjaman) {
      return NextResponse.json(
        {
          error:
            "karyawan_id, inventory_id, dan tanggal_peminjaman harus diisi"
        },
        { status: 400 }
      );
    }

    // 3. Ubah ID menjadi number
    const karyawanId = parseInt(karyawan_id, 10);
    const inventoryId = parseInt(inventory_id, 10);

    // 4. Cek apakah inventory ada
    const inventory = await prisma.inventory.findUnique({
      where: {
        id: inventoryId
      }
    });

    if (!inventory) {
      return NextResponse.json(
        { error: "Inventory tidak ditemukan" },
        { status: 404 }
      );
    }

    // 5. Cek status inventory
    if (inventory.status === "dipinjam") {
      return NextResponse.json(
        { error: "Inventory sedang dipinjam" },
        { status: 400 }
      );
    }

    // 6. Transaction
    const result = await prisma.$transaction(async (tx) => {

      // Buat peminjaman
      const peminjaman = await tx.peminjaman.create({
        data: {
          karyawan_id: karyawanId,
          inventory_id: inventoryId,
          tanggal_peminjaman: new Date(tanggal_peminjaman),
        },
      });

      // Ubah status inventory
      await tx.inventory.update({
        where: {
          id: inventoryId
        },
        data: {
          status: "dipinjam",
        },
      });

      return peminjaman;
    });

    // 7. Kirim hasil
    return NextResponse.json(
      result,
      { status: 201 }
    );

  } catch (error) {
    console.error("Error POST peminjaman:", error);

    return NextResponse.json(
      {
        error:
          "Terjadi kesalahan saat memproses peminjaman"
      },
      { status: 500 }
    );
  }
}