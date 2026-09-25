export default function DashboardPage() {
  // Data ini diketik mati (hardcoded), tidak akan pernah berubah secara otomatis
  const totalKaryawan = 45;
  const totalBarang = 120;
  const barangDipinjam = 15;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Ringkasan</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kartu Informasi 1 */}
        <div className="border border-gray-200 p-6 rounded bg-white">
          <h2 className="text-gray-600 mb-2 text-sm font-medium">Total Karyawan</h2>
          <p className="text-3xl font-semibold">{totalKaryawan}</p>
        </div>
        
        {/* Kartu Informasi 2 */}
        <div className="border border-gray-200 p-6 rounded bg-white">
          <h2 className="text-gray-600 mb-2 text-sm font-medium">Total Barang</h2>
          <p className="text-3xl font-semibold">{totalBarang}</p>
        </div>

        {/* Kartu Informasi 3 */}
        <div className="border border-gray-200 p-6 rounded bg-white">
          <h2 className="text-gray-600 mb-2 text-sm font-medium">Barang Dipinjam</h2>
          <p className="text-3xl font-semibold">{barangDipinjam}</p>
        </div>
      </div>
    </div>
  );
}