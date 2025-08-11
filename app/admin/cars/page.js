'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../lib/supabase'

export default function AdminCars() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const adminData = localStorage.getItem('admin')
    if (!adminData) {
      router.push('/admin/login')
      return
    }
    setAdmin(JSON.parse(adminData))
    fetchCars()
  }, [router])

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCars(data || [])
    } catch (error) {
      console.error('Error fetching cars:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus mobil ini?')) return;
  
    try {
      // 1️⃣ Ambil data mobil untuk dapat image_url
      const { data: carData, error: fetchError } = await supabase
        .from('cars')
        .select('image_url')
        .eq('id', id)
        .single();
  
      if (fetchError) throw fetchError;
  
      // 2️⃣ Hapus file gambar di storage
      if (carData?.image_url) {
        const fileName = carData.image_url.split('/').pop(); // ambil nama file saja
        const { error: deleteFileError } = await supabase
          .storage
          .from('cars') // bucket name
          .remove([fileName]);
  
        if (deleteFileError) {
          console.error('Gagal menghapus file gambar:', deleteFileError);
        }
      }
  
      // 3️⃣ Hapus data mobil di tabel
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', id);
  
      if (error) throw error;
  
      // 4️⃣ Refresh data mobil
      await fetchCars();
  
    } catch (error) {
      console.error('Error deleting car:', error);
      alert('Gagal menghapus mobil');
    }
  };
  

  if (!admin) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6 w-full">
            <div className="flex items-center justify-between space-x-4 w-full">
              <Link
                href="/admin/dashboard"
                className="text-gray-700 hover:text-red-600 transition-colors"
              >
                Dashboard
              </Link>
              <span className="text-gray-700">Welcome, {admin.username}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4 sm:gap-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kelola Mobil</h1>
            <p className="text-gray-600">Tambah, edit, dan hapus data mobil</p>
          </div>
          <Link
            href="/admin/cars/add"
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-300 font-semibold self-start sm:self-auto"
          >
            Tambah Mobil
          </Link>
        </div>

        {/* Cars Table */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : cars.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gambar
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Mobil
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Harga
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal Dibuat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cars.map((car) => (
                    <tr key={car.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex-shrink-0 h-16 w-24">
                          {car.image_url ? (
                            <img
                              className="h-16 w-24 object-cover rounded-lg"
                              src={car.image_url}
                              alt={car.name}
                            />
                          ) : (
                            <div className="h-16 w-24 bg-gray-200 rounded-lg flex items-center justify-center">
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{car.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          Rp {car.price ? car.price.toLocaleString('id-ID') : '0'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(car.created_at).toLocaleDateString('id-ID')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/cars/edit/${car.id}`}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(car.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum ada mobil</h3>
            <p className="text-gray-600 mb-4">Mulai dengan menambahkan mobil pertama Anda.</p>
            <Link
              href="/admin/cars/add"
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-300 font-semibold"
            >
              Tambah Mobil Pertama
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
