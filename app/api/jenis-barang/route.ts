import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(){
    try{
        const data = await prisma.jenisBarang.findMany();
        return NextResponse.json(data);
    }catch(error){
        console.error("Error GET jenis barang", error);
        return NextResponse.json(
            {error: "Gagal menampilkan data Jenis Barang"},
            {status:500}
        )
    }
}
    export async function POST(request:Request){
        try{
            const body = await request.json();
            const data : {
                jenis_barang: string} = body;
            const newJenisBarang = await prisma.jenisBarang.create({
                data:{
                    jenis_barang: data.jenis_barang,
                },
            });
            await prisma.riwayat.create({
      data: {
        id_barang : newJenisBarang.id,
        jenis_barang: newJenisBarang.jenis_barang,
        jenis : "Kategori Barang",
        aktivitas: "Menambah jenis barang baru",
        keterangan: `Jenis barang baru ${newJenisBarang.jenis_barang} telah ditambahkan`,
      }
    })
            return NextResponse.json(newJenisBarang, {status: 201});
        }catch(error){
            console.error("Error Menambahkan Jenis Barang", error);
            return NextResponse.json(
                {error: "Gagal Menambahkan Jenis Barang"}, {status:500}
            );
        }
    }