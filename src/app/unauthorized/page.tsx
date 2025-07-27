export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Akses Ditolak</h1>
      <p className="mb-6">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
      <a href="/" className="px-4 py-2 bg-blue-600 text-white rounded">Kembali ke Beranda</a>
    </div>
  );
}