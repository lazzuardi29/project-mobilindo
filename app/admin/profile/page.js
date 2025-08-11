'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../lib/supabase'

export default function AdminProfile() {
  const [formData, setFormData] = useState({
    username: '',
    admin_code: ''
  })
  const [loading, setLoading] = useState(false)
  const [admin, setAdmin] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const adminData = localStorage.getItem('admin')
    if (!adminData) {
      router.push('/admin/login')
      return
    }
    const adminInfo = JSON.parse(adminData)
    setAdmin(adminInfo)
    setFormData({
      username: adminInfo.username || '',
      admin_code: adminInfo.admin_code || ''
    })
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('admin')
        .update({
          username: formData.username,
          admin_code: formData.admin_code
        })
        .eq('id', admin.id)

      if (error) throw error

      // Update localStorage with new data
      const updatedAdmin = { ...admin, ...formData }
      localStorage.setItem('admin', JSON.stringify(updatedAdmin))
      setAdmin(updatedAdmin)

      alert('Profil berhasil diupdate')
      router.push('/admin/dashboard')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Gagal mengupdate profil')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

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

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profil Admin</h1>
          <p className="text-gray-600">Edit informasi profil dan kredensial login</p>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-lg shadow p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Masukkan username"
              />
            </div>

            <div>
              <label htmlFor="admin_code" className="block text-sm font-medium text-gray-700 mb-2">
                Kode Admin
              </label>
              <input
                type="password"
                id="admin_code"
                name="admin_code"
                required
                value={formData.admin_code}
                onChange={handleChange}
                className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Masukkan kode admin"
              />
              <p className="mt-1 text-sm text-gray-500">
                Kode ini digunakan untuk login ke panel admin
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <Link
                href="/admin/dashboard"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Menyimpan...' : 'Update Profil'}
              </button>
            </div>
          </form>
        </div>

        {/* Admin Info */}
        <div className="mt-8 bg-white rounded-lg shadow p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Informasi Admin</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">ID Admin:</span>
              <span className="font-medium text-gray-900">{admin.id}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Tanggal Dibuat:</span>
              <span className="font-medium text-gray-900">
                {new Date(admin.created_at).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
