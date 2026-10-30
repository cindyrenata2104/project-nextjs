import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.riwayat.findMany({
      orderBy: {
        tanggal: "desc"
      },
    });

    return NextResponse.json(data);

  } catch (error) {
    console.error("Error GET riwayat:", error);

    return NextResponse.json(
      {
        error: "Terjadi kesalahan saat mengambil data riwayat",
      },
      { status: 500 }
    );
  }
}