'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../../../lib/supabase'

export default function EditGallery() {
  const [formData, setFormData] = useState({
    description: '',
    image_url: ''
  })
  const [loading, setLoading] = useState(false)
  const [admin, setAdmin] = useState(null)
  const [previewImage, setPreviewImage] = useState(null) // untuk review foto
  const [imageFile, setImageFile] = useState(null) // file gambar yang diupload
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const adminData = localStorage.getItem('admin')
    if (!adminData) {
      router.push('/admin/login')
      return
    }
    setAdmin(JSON.parse(adminData))
    fetchGalleryItem()
  }, [router, params.id])

  const fetchGalleryItem = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error

      setFormData({
        description: data.description || '',
        image_url: data.image_url || ''
      })
      setPreviewImage(data.image_url || null)
    } catch (error) {
      console.error('Error fetching gallery item:', error)
      router.push('/admin/gallery')
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setPreviewImage(URL.createObjectURL(file)) // tampilkan preview
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      let imageUrl = formData.image_url;
  
      // jika ada gambar baru yang dipilih
      if (imageFile) {
        // 1️⃣ Hapus file lama kalau ada
        if (formData.image_url) {
          const oldFilePath = formData.image_url.split('/').pop(); 
          // Kalau file lama disimpan dalam folder "gallery", tambahkan:
          // const oldFilePath = `gallery/${formData.image_url.split('/').pop()}`;
  
          const { error: deleteError } = await supabase.storage
            .from('gallery')
            .remove([oldFilePath]);
  
          if (deleteError) {
            console.error('Gagal menghapus file lama:', deleteError);
          }
        }
  
        // 2️⃣ Upload file baru
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        //const filePath = `gallery/${fileName}`; // kalau mau pakai folder
  
        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(fileName, imageFile);
  
        if (uploadError) throw uploadError;
  
        // 3️⃣ Ambil public URL baru
        const { data: publicUrlData } = supabase.storage
          .from('gallery')
          .getPublicUrl(fileName);
  
        imageUrl = publicUrlData.publicUrl;
      }
  
      // 4️⃣ Update data di tabel
      const { error } = await supabase
        .from('gallery')
        .update({
          description: formData.description,
          image_url: imageUrl
        })
        .eq('id', params.id);
  
      if (error) throw error;
  
      router.push('/admin/gallery');
    } catch (error) {
      console.error('Error updating gallery item:', error);
      alert('Gagal mengupdate item galeri');
    } finally {
      setLoading(false);
    }
  };
  

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
              <Link href="/admin/dashboard" className="text-gray-700 hover:text-red-600 transition-colors">
                Dashboard
              </Link>
              <Link href="/admin/gallery" className="text-gray-700 hover:text-red-600 transition-colors">
                Kelola Galeri
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Foto Galeri</h1>
          <p className="text-gray-600">Edit informasi foto galeri</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi Aktivitas
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                placeholder="Deskripsikan aktivitas atau event yang ditunjukkan dalam foto"
              />
            </div>

            <div>
              <label htmlFor="image_file" className="block text-sm font-medium text-gray-700 mb-2">
                Upload Gambar
              </label>
              <input
                type="file"
                accept="image/*"
                id="image_file"
                onChange={handleImageChange}
                className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg"
              />
              {previewImage && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Preview Gambar:</p>
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="mt-2 max-h-64 rounded-lg shadow"
                  />
                </div>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Pilih file gambar baru atau biarkan kosong untuk mempertahankan gambar lama
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <Link
                href="/admin/gallery"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Menyimpan...' : 'Update Foto'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
