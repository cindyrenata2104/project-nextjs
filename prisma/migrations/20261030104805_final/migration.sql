-- CreateEnum
CREATE TYPE "StatusInventory" AS ENUM ('tersedia', 'dipinjam');

-- CreateTable
CREATE TABLE "Inventory" (
    "id" SERIAL NOT NULL,
    "kode_barang" TEXT NOT NULL DEFAULT '',
    "jenis_barang" TEXT NOT NULL,
    "jenis_barang_id" INTEGER,
    "ukuran" TEXT NOT NULL,
    "status" "StatusInventory" NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JenisBarang" (
    "id" SERIAL NOT NULL,
    "jenis_barang" TEXT NOT NULL,

    CONSTRAINT "JenisBarang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Karyawan" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    "tanggal_mulai" TIMESTAMP(3),
    "tanggal_selesai" TIMESTAMP(3),

    CONSTRAINT "Karyawan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Peminjaman" (
    "id" SERIAL NOT NULL,
    "karyawan_id" INTEGER NOT NULL,
    "inventory_id" INTEGER NOT NULL,
    "tanggal_peminjaman" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Peminjaman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pengembalian" (
    "id" SERIAL NOT NULL,
    "peminjaman_id" INTEGER NOT NULL,
    "tanggal_pengembalian" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pengembalian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Riwayat" (
    "id" SERIAL NOT NULL,
    "id_karyawan" INTEGER,
    "nama_karyawan" TEXT,
    "id_barang" INTEGER,
    "jenis_barang" TEXT,
    "jenis" TEXT NOT NULL,
    "aktivitas" TEXT NOT NULL,
    "keterangan" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Riwayat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_kode_barang_key" ON "Inventory"("kode_barang");

-- CreateIndex
CREATE UNIQUE INDEX "Pengembalian_peminjaman_id_key" ON "Pengembalian"("peminjaman_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_jenis_barang_id_fkey" FOREIGN KEY ("jenis_barang_id") REFERENCES "JenisBarang"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Peminjaman" ADD CONSTRAINT "Peminjaman_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Peminjaman" ADD CONSTRAINT "Peminjaman_karyawan_id_fkey" FOREIGN KEY ("karyawan_id") REFERENCES "Karyawan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pengembalian" ADD CONSTRAINT "Pengembalian_peminjaman_id_fkey" FOREIGN KEY ("peminjaman_id") REFERENCES "Peminjaman"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
