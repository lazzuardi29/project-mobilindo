'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../../lib/supabase'

export default function AddGallery() {
  const [formData, setFormData] = useState({
    description: '',
    image_url: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [admin, setAdmin] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const adminData = localStorage.getItem('admin')
    if (!adminData) {
      router.push('/admin/login')
      return
    }
    setAdmin(JSON.parse(adminData))
  }, [router])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let uploadedImageUrl = formData.image_url

      // Kalau ada file yang diupload
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `gallery/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('gallery') // ganti dengan nama bucket storage
          .upload(filePath, imageFile)

        if (uploadError) throw uploadError

        const { data: publicUrlData } = supabase.storage
          .from('gallery') // bucket name
          .getPublicUrl(filePath)

        uploadedImageUrl = publicUrlData.publicUrl
      }

      // Simpan ke tabel
      const { error } = await supabase
        .from('gallery')
        .insert([{
          description: formData.description,
          image_url: uploadedImageUrl
        }])

      if (error) throw error

      router.push('/admin/gallery')
    } catch (error) {
      console.error('Error adding gallery item:', error)
      alert('Gagal menambahkan item galeri')
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
              <span className="text-xl font-bold text-gray-800">MOBILINDO</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard">Dashboard</Link>
              <Link href="/admin/gallery">Kelola Galeri</Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tambah Foto Galeri</h1>
          <p className="text-gray-600">Tambahkan foto aktivitas baru ke galeri</p>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi Aktivitas
              </label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Deskripsikan aktivitas atau event"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Gambar
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg"
              />

              {/* Preview Gambar */}
              {previewUrl && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Preview Gambar:</p>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="mt-2 max-h-64 rounded-lg shadow"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <Link
                href="/admin/gallery"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-red-600 text-white rounded-lg"
              >
                {loading ? 'Menyimpan...' : 'Simpan Foto'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
