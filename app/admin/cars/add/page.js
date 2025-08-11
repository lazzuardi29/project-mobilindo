'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../../lib/supabase'

export default function AddCar() {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image_url: ''
  })
  const [loading, setLoading] = useState(false)
  const [admin, setAdmin] = useState(null)
  const router = useRouter()
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const adminData = localStorage.getItem('admin')
    if (!adminData) {
      router.push('/admin/login')
      return
    }
    setAdmin(JSON.parse(adminData))
  }, [router])

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setPreviewUrl('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Validasi semua field wajib diisi
    if (
      formData.name.trim() === "" ||
      formData.price === "" ||
      !imageFile
    ) {
      setErrorMessage("Harap isi semua field terlebih dahulu.");
      setLoading(false)
      return;
    }

    setErrorMessage(""); // reset error kalau valid

    let image_url = '';

    // Upload file jika ada
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('cars')
        .upload(fileName, imageFile);

      if (error) {
        alert('Gagal upload gambar: ' + error.message);
        setLoading(false);
        return;
      }

      // Dapatkan public URL
      const { data: publicUrlData } = supabase.storage
        .from('cars')
        .getPublicUrl(fileName);
      image_url = publicUrlData.publicUrl;
    }

    try {
      const { error } = await supabase
        .from('cars')
        .insert([{
          name: formData.name,
          price: parseFloat(formData.price),
          image_url: image_url
        }])

      if (error) throw error

      router.push('/admin/cars')
    } catch (error) {
      console.error('Error adding car:', error)
      alert('Gagal menambahkan mobil')
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
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/dashboard"
                className="text-gray-700 hover:text-red-600 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/cars"
                className="text-gray-700 hover:text-red-600 transition-colors"
              >
                Kelola Mobil
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tambah Mobil</h1>
          <p className="text-gray-600">Tambahkan mobil baru ke showroom</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Mobil
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Contoh: Toyota Avanza"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Harga (Rp)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
                className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="250000000"
              />
            </div>

            <div>
              <label htmlFor="image_file" className="block text-sm font-medium text-gray-700 mb-2">
                Upload Gambar Mobil
              </label>
              <input
                type="file"
                id="image_file"
                name="image_file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <p className="mt-1 text-sm text-gray-500">
                Pilih atau drag file gambar mobil (jpg/png, max 2MB)
              </p>
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
              {/* Pesan error jika form belum lengkap */}
              {errorMessage && (
                <p className="text-red-600 text-sm mt-2">{errorMessage}</p>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <Link
                href="/admin/cars"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Menyimpan...' : 'Simpan Mobil'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
