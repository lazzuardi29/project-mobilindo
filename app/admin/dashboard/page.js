'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  const [admin, setAdmin] = useState(null)
  const [totalCars, setTotalCars] = useState(0)
  const [totalGallery, setTotalGallery] = useState(0)
  const [totalAdmins, setTotalAdmins] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const adminData = localStorage.getItem('admin')
    if (!adminData) {
      router.push('/admin/login')
      return
    }
    setAdmin(JSON.parse(adminData))
  }, [router])

  useEffect(() => {
    if (admin) {
      fetchTotals()
    }
  }, [admin])

  const fetchTotals = async () => {
    try {
      const { count: carsCount, error: carsError } = await supabase
        .from('cars')
        .select('*', { count: 'exact', head: true })
      if (carsError) throw carsError
      setTotalCars(carsCount || 0)

      const { count: galleryCount, error: galleryError } = await supabase
        .from('gallery')
        .select('*', { count: 'exact', head: true })
      if (galleryError) throw galleryError
      setTotalGallery(galleryCount || 0)

      const { count: adminsCount, error: adminsError } = await supabase
        .from('admin')
        .select('*', { count: 'exact', head: true })
      if (adminsError) throw adminsError
      setTotalAdmins(adminsCount || 0)

    } catch (error) {
      console.error('Error fetching counts:', error.message)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin')
  
    // dispatch event supaya Header tahu admin logout
    window.dispatchEvent(new Event('adminChange'))
  
    router.push('/admin/login')
  }

  if (!admin) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end items-center py-6">
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {admin.username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Dashboard Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Kelola konten website 3N MOBILINDO
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Manage Cars */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-4">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 13l1.5-4.5a2 2 0 012-1.5h11a2 2 0 012 1.5L21 13v6a1 1 0 01-1 1h-1a2 2 0 11-4 0H9a2 2 0 11-4 0H4a1 1 0 01-1-1v-6zM7 13h10"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Kelola Mobil</h3>
              <p className="text-gray-600 mb-4">
                Tambah, edit, dan hapus data mobil dari showroom
              </p>
              <Link
                href="/admin/cars"
                className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300"
              >
                Kelola Mobil
              </Link>
            </div>
          </div>

          {/* Manage Gallery */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Kelola Galeri</h3>
              <p className="text-gray-600 mb-4">
                Tambah, edit, dan hapus foto aktivitas galeri
              </p>
              <Link
                href="/admin/gallery"
                className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300"
              >
                Kelola Galeri
              </Link>
            </div>
          </div>

          {/* Admin Profile */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Profil Admin</h3>
              <p className="text-gray-600 mb-4">
                Edit profil admin dan ubah kredensial login
              </p>
              <Link
                href="/admin/profile"
                className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300"
              >
                Edit Profil
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 13l1.5-4.5a2 2 0 012-1.5h11a2 2 0 012 1.5L21 13v6a1 1 0 01-1 1h-1a2 2 0 11-4 0H9a2 2 0 11-4 0H4a1 1 0 01-1-1v-6zM7 13h10"
                  />
                </svg>

                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Mobil</p>
                <p className="text-2xl font-semibold text-gray-900">{totalCars}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Galeri</p>
                <p className="text-2xl font-semibold text-gray-900">{totalGallery}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Admin Aktif</p>
                <p className="text-2xl font-semibold text-gray-900">{totalAdmins}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
