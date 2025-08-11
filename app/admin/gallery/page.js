'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../lib/supabase'

export default function AdminGallery() {
  const [gallery, setGallery] = useState([])
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
    fetchGallery()
  }, [router])

  const fetchGallery = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setGallery(data || [])
    } catch (error) {
      console.error('Error fetching gallery:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus item galeri ini?')) return;
  
    try {
      // 1️⃣ Ambil URL gambar sebelum hapus row
      const { data: galleryItem, error: fetchError } = await supabase
        .from('gallery')
        .select('image_url')
        .eq('id', id)
        .single();
  
      if (fetchError) throw fetchError;
  
      // 2️⃣ Hapus file di bucket 'gallery'
      if (galleryItem?.image_url) {
        const fileName = galleryItem.image_url.split('/').pop(); // ambil nama file saja
        const { error: deleteFileError } = await supabase
          .storage
          .from('gallery')
          .remove([fileName]);
  
        if (deleteFileError) {
          console.error('Gagal menghapus file gambar:', deleteFileError);
        }
      }
  
      // 3️⃣ Hapus data galeri di tabel
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);
  
      if (error) throw error;
  
      // 4️⃣ Refresh data galeri
      await fetchGallery();
  
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      alert('Gagal menghapus item galeri');
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
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="w-12 h-8 relative">
                  <div className="absolute top-2 left-4 w-6 h-3 bg-gradient-to-r from-gray-700 to-gray-900 rounded-t-lg"></div>
                  <div className="absolute top-5 left-2 w-8 h-2 bg-red-600 rounded-full"></div>
                  <div className="absolute top-1 left-8 w-1 h-1 bg-white rounded-full"></div>
                </div>
                <div className="absolute -bottom-2 left-1">
                  <span className="text-2xl font-bold text-red-600 drop-shadow-sm">3N</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-800">MOBILINDO</span>
                <div className="w-full h-0.5 bg-gradient-to-r from-gray-700 to-gray-900"></div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kelola Galeri</h1>
            <p className="text-gray-600">Tambah, edit, dan hapus foto aktivitas galeri</p>
          </div>
          <Link
            href="/admin/gallery/add"
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-300 font-semibold"
          >
            Tambah Foto
          </Link>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : gallery.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gallery.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-64 bg-gray-200">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.description}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Galeri
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 text-lg leading-relaxed mb-4">{item.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>
                      {new Date(item.created_at).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      href={`/admin/gallery/edit/${item.id}`}
                      className="flex-1 bg-blue-600 text-white text-center px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum ada foto galeri</h3>
            <p className="text-gray-600 mb-4">Mulai dengan menambahkan foto pertama ke galeri.</p>
            <Link
              href="/admin/gallery/add"
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-300 font-semibold"
            >
              Tambah Foto Pertama
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
