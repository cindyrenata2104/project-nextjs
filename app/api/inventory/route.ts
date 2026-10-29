import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session){
      return NextResponse.json(
        {error: "Unauthorized"},
        {status:401}
      )
    }
    const data = await prisma.inventory.findMany();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error GET inventory:", error);
    return NextResponse.json({ error: "Failed to get inventory" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if(!session){
      return NextResponse.json(
        {error:"Unauthorized"},
        {status:401}
      )
    }
    const body = await request.json();
    const { jenis_barang, ukuran, status } = body;

    if (!jenis_barang || !ukuran || !status) {
      console.error("Field harus diisi", body);
      return NextResponse.json(
        { error: "jenis_barang, ukuran, dan status harus diisi" },
        { status: 400 }
      );
    }
    const hasil = await prisma.$queryRaw<{ nomor: bigint }[]>`
  SELECT nextval('kode_barang_seq') AS nomor
`;

const kode_barang = `BRG-${String(hasil[0].nomor).padStart(3, '0')}`;

    const newInventory = await prisma.inventory.create({
      
      data: {
        kode_barang,
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
        keterangan: `Inventory baru ${newInventory.jenis_barang} dengan ukuran ${newInventory.ukuran} dan kode barang ${newInventory.kode_barang} telah ditambahkan`,
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
