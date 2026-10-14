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
    const kegiatan = 'Periode';
    const updatedKaryawan = await prisma.karyawan.update({
      where: { id },
      data: {tanggal_mulai:body.tanggal_mulai, tanggal_selesai:body.tanggal_selesai},
    });

    // Tambahkan pencatatan riwayat di sini
    const riwayat = await prisma.riwayat.create({
      data: {
        id_karyawan: updatedKaryawan.id,
        nama_karyawan: updatedKaryawan.nama,
        jenis: "Karyawan",
        aktivitas: `Ubah ${kegiatan} Karyawan`,
       keterangan: `Periode kerja karyawan ${updatedKaryawan.nama} telah diubah menjadi periode ${updatedKaryawan.tanggal_mulai} sampai ${updatedKaryawan.tanggal_selesai}`,     }
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
