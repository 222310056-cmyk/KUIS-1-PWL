'use client';

import { useState, useEffect } from 'react';

interface Buku {
  id?: number;
  judul: string;
  pengarang: string;
  peminjam: string;
}

export default function HomePage() {
  const [daftarBuku, setDaftarBuku] = useState<Buku[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  // State Form
  const [judul, setJudul] = useState('');
  const [pengarang, setPengarang] = useState('');
  const [peminjam, setPeminjam] = useState('');

  // 1. READ: Ambil Data dari Backend Kuis 1
  const ambilData = async () => {
  try {
    // Tambahkan /api sebelum kata /buku
    const response = await fetch('http://localhost:3000/api/buku');
    const data = await response.json();
    setDaftarBuku(data);
  } catch (error) {
    console.error("Gagal mengambil data:", error);
  }
};

  useEffect(() => {
    ambilData();
  }, []);

  // 2. CREATE & UPDATE: Fungsi Simpan Data
  const handleSimpanBuku = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditMode && selectedId 
  ? `http://localhost:3000/api/buku/${selectedId}` 
  : 'http://localhost:3000/api/buku';
        
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ judul, pengarang, peminjam }),
      });

      if (response.ok) {
        alert(isEditMode ? 'Data berhasil diubah!' : 'Data berhasil ditambahkan!');
        resetForm();
        ambilData();
      } else {
        alert('Gagal memproses data.');
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // 3. DELETE: Fungsi Hapus Data
  const handleHapus = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        const response = await fetch(`http://localhost:3000/buku/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Data berhasil dihapus!');
          ambilData();
        } else {
          alert('Gagal menghapus data.');
        }
      } catch (error) {
        console.error("Error saat menghapus:", error);
      }
    }
  };

  // Fungsi triggers Edit Mode
  const bukaModalEdit = (buku: Buku) => {
    if (buku.id !== undefined) {
      setIsEditMode(true);
      setSelectedId(buku.id);
      setJudul(buku.judul);
      setPengarang(buku.pengarang);
      setPeminjam(buku.peminjam);
      setIsModalOpen(true);
    }
  };

  const resetForm = () => {
    setJudul('');
    setPengarang('');
    setPeminjam('');
    setIsEditMode(false);
    setSelectedId(null);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-black">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Sistem Peminjaman Buku (Kuis 2 PWL)
        </h1>

        <div className="mb-4 text-right">
          <button 
            onClick={() => { setIsEditMode(false); setIsModalOpen(true); }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow transition"
          >
            + Tambah Peminjaman
          </button>
        </div>

        {/* TABEL DATA */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Judul Buku</th>
                <th className="py-3 px-6 text-left">Pengarang</th>
                <th className="py-3 px-6 text-left">Nama Peminjam</th>
                <th className="py-3 px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {daftarBuku.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-3 px-6 text-center text-gray-500">
                    Belum ada data peminjaman buku.
                  </td>
                </tr>
              ) : (
                daftarBuku.map((buku, index) => (
                  <tr key={buku.id || index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left font-medium">{buku.judul}</td>
                    <td className="py-3 px-6 text-left">{buku.pengarang}</td>
                    <td className="py-3 px-6 text-left">{buku.peminjam}</td>
                    <td className="py-3 px-6 text-center">
                      <button 
                        onClick={() => bukaModalEdit(buku)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 text-xs hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => buku.id !== undefined && handleHapus(buku.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* POPUP MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? 'Form Edit Peminjaman' : 'Form Tambah Peminjaman'}
            </h2>
            <form onSubmit={handleSimpanBuku}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Judul Buku</label>
                <input 
                  type="text" required value={judul} onChange={(e) => setJudul(e.target.value)}
                  className="w-full border p-2 rounded text-black bg-gray-50"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Pengarang</label>
                <input 
                  type="text" required value={pengarang} onChange={(e) => setPengarang(e.target.value)}
                  className="w-full border p-2 rounded text-black bg-gray-50"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Nama Peminjam</label>
                <input 
                  type="text" required value={peminjam} onChange={(e) => setPeminjam(e.target.value)}
                  className="w-full border p-2 rounded text-black bg-gray-50"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button 
                  type="button" onClick={resetForm}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {isEditMode ? 'Simpan Perubahan' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}