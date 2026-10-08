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
    const info = body.info;
    let kegiatan =""
    if(info === "periode"){
      kegiatan = 'periode'


    }else kegiatan = 'Status'
    const updatedKaryawan = await prisma.karyawan.update({
      where: { id },
      data: {tanggal_mulai:body.tanggal_mulai, tanggal_selesai:body.tanggal_selesai, status_kerja:body.status_kerja},
    });

    // Tambahkan pencatatan riwayat di sini
    const riwayat = await prisma.riwayat.create({
      data: {
        id_karyawan: updatedKaryawan.id,
        nama_karyawan: updatedKaryawan.nama,
        jenis: "Karyawan",
        aktivitas: `Ubah ${kegiatan} Karyawan`,
        keterangan: `${info === "periode" ? "Periode" : "Status"} kerja  karyawan ${updatedKaryawan.nama} telah diubah ${info === "periode" ? `menjadi periode ${updatedKaryawan.tanggal_mulai} sampai ${updatedKaryawan.tanggal_selesai}`: `menjadi ${updatedKaryawan.status_kerja}`}`,
      }
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
