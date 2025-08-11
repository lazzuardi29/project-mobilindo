'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: '', admin_code: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase
        .from('admin')
        .select('*')
        .eq('username', credentials.username)
        .eq('admin_code', credentials.admin_code)
        .single()

      if (error || !data) {
        setError('Username atau kode admin salah')
        return
      }

      // Store admin data in localStorage
      localStorage.setItem('admin', JSON.stringify(data))

      // dispatch custom event supaya Header update state
      window.dispatchEvent(new Event('adminChange'))

      router.push('/admin/dashboard')
    } catch (error) {
      setError('Terjadi kesalahan saat login')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/images/logo2.jpg" 
                alt="3N MOBILINDO Logo" 
                className="w-30 h-10 object-cover rounded-lg" 
              />
            </div>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Masuk ke panel admin untuk mengelola konten
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={credentials.username}
                  onChange={handleChange}
                  className="appearance-none text-gray-900 block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="Masukkan username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin_code" className="block text-sm font-medium text-gray-700">
                Kode Admin
              </label>
              <div className="mt-1">
                <input
                  id="admin_code"
                  name="admin_code"
                  type="password"
                  required
                  value={credentials.admin_code}
                  onChange={handleChange}
                  className="appearance-none text-gray-900 block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="Masukkan kode admin"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Memproses...' : 'Masuk'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
