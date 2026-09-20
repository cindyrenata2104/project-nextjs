import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id, 10);
    const body = await request.json();

    const updatedKaryawan = await prisma.karyawan.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updatedKaryawan);
  } catch (error) {
    console.error("Error updating karyawan:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui data karyawan" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id, 10);

    await prisma.karyawan.delete({ where: { id } });

    return NextResponse.json({ message: "Karyawan berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting karyawan:", error);
    return NextResponse.json(
      { error: "Gagal menghapus data karyawan" },
      { status: 500 }
    );
  }
}
