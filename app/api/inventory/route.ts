import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const data = await prisma.inventory.findMany();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error GET inventory:", error);
    return NextResponse.json({ error: "Failed to get inventory" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { jenis_barang, ukuran, status } = body;

    if (!jenis_barang || !ukuran || !status) {
      return NextResponse.json(
        { error: "jenis_barang, ukuran, dan status harus diisi" },
        { status: 400 }
      );
    }

    const newInventory = await prisma.inventory.create({
      data: {
        jenis_barang,
        ukuran,
        status,
      }
    });

    await prisma.riwayat.create({
      data: {
        id_barang : newInventory.id,
        jenis_barang: newInventory.jenis_barang,
        jenis : "Inventory",
        aktivitas: "Menambah inventory baru",
        keterangan: `Inventory baru ${newInventory.jenis_barang} dengan ukuran ${newInventory.ukuran} telah ditambahkan`,
      }
    })

    return NextResponse.json(newInventory, { status: 201 });
  } catch (error) {
    console.error("Error saat POST inventory:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menambahkan barang" },
      { status: 500 }
    );
  }
}
