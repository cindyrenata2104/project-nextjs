import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ==========================================
// GET - Mengambil semua data pengembalian
// ==========================================
export async function GET() {
  try {
    const data = await prisma.pengembalian.findMany({
      include: {
        peminjaman: {
          include: {
            karyawan: true,
            inventory: true,
          },
        },
      },
    });

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error GET pengembalian:', error);

    return NextResponse.json(
      {
        error: 'Terjadi kesalahan saat mengambil data pengembalian',
      },
      {
        status: 500,
      }
    );
  }
}

// ==========================================
// POST - Membuat data pengembalian
// ==========================================
export async function POST(request: Request) {
  try {
    // 1. Ambil data dari frontend
    const body = await request.json();
    const { peminjaman_id, tanggal_pengembalian } = body;

    // ==========================================
    // 2. Validasi data
    // ==========================================
    if (!peminjaman_id || !tanggal_pengembalian) {
      return NextResponse.json(
        {
          error: 'peminjaman_id dan tanggal_pengembalian harus diisi',
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // 3. Cari peminjaman untuk memastikan datanya ada
    // dan mengambil inventory_id
    // ==========================================
    const peminjaman = await prisma.peminjaman.findUnique({
      where: {
        id: parseInt(peminjaman_id, 10),
      },
    });

    if (!peminjaman) {
      return NextResponse.json(
        {
          error: 'Data transaksi peminjaman tidak ditemukan',
        },
        {
          status: 404,
        }
      );
    }

    // ==========================================
    // 4. Transaction
    // A. Buat Pengembalian
    // B. Ubah status Inventory jadi "inventory"
    // ==========================================
    const result = await prisma.$transaction(async (tx) => {
      // A. Buat data Pengembalian
      const pengembalian = await tx.pengembalian.create({
        data: {
          peminjaman_id: peminjaman.id,
          tanggal_pengembalian: new Date(tanggal_pengembalian),
        },
      });

      // B. Ubah status Inventory
      await tx.inventory.update({
        where: {
          id: peminjaman.inventory_id,
        },
        data: {
          status: 'inventory',
        },
      });

      //ubah status karyawan menjadi inactive
      await tx.karyawan.update({
        where:{
          id: peminjaman.karyawan_id,
        },  
        data:{
          status_kerja: 'inactive', 
        }
      })

      // Kembalikan hasil
      return pengembalian;
    });

    // ==========================================
    // 5. Response berhasil
    // ==========================================
    return NextResponse.json(result, {
      status: 201,
    });
  } catch (error) {
    // ==========================================
    // 6. Error handling
    // ==========================================
    console.error('Error POST pengembalian:', error);
    return NextResponse.json(
      {
        error: 'Terjadi kesalahan saat memproses pengembalian',
      },
      {
        status: 500,
      }
    );
  }
}
