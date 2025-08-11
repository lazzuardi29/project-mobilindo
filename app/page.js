'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [heroHeight, setHeroHeight] = useState('100vh')
  const [featuredCars, setFeaturedCars] = useState([])
  const [featuredGallery, setFeaturedGallery] = useState([])

  useEffect(() => {
    // Function to calculate hero height
    const calculateHeroHeight = () => {
      const header = document.querySelector('header')
      const headerHeight = header ? header.offsetHeight : 0
      const viewportHeight = window.innerHeight
      const calculatedHeight = viewportHeight - headerHeight
      setHeroHeight(`${calculatedHeight}px`)
    }

    // Calculate on mount and resize
    calculateHeroHeight()
    window.addEventListener('resize', calculateHeroHeight)

    // Cleanup
    return () => window.removeEventListener('resize', calculateHeroHeight)
  }, [])

  useEffect(() => {
    // Fetch data functions
    const getFeaturedCars = async () => {
      const { data: cars, error } = await supabase
        .from('cars')
        .select('*')
        .limit(6)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching cars:', error)
        return []
      }
      
      return cars || []
    }

    const getFeaturedGallery = async () => {
      const { data: gallery, error } = await supabase
        .from('gallery')
        .select('*')
        .limit(6)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching gallery:', error)
        return []
      }
      
      return gallery || []
    }

    // Fetch data
    const fetchData = async () => {
      const [cars, gallery] = await Promise.all([
        getFeaturedCars(),
        getFeaturedGallery()
      ])
      setFeaturedCars(cars)
      setFeaturedGallery(gallery)
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative flex flex-col lg:flex-row overflow-hidden"
        style={{ height: heroHeight }}
      >
        {/* Left Side - Background Image (Hidden on mobile) */}
        <div className="hidden lg:block lg:h-full lg:w-1/2 relative">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/images/hero.jpeg')`
            }}
          ></div>
          {/* Left Side Overlay */}
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute inset-0 bg-gradient-to-r lg:from-red-600/20 lg:to-transparent from-transparent to-transparent"></div>
        </div>
        
        {/* Right Side - Content (Full width on mobile) */}
        <div className="h-full lg:h-full lg:w-1/2 flex items-center justify-center bg-black relative w-full">
          <div className="text-center text-white px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-lg mx-auto py-6 sm:py-8 md:py-12">
            <div className="mb-3 sm:mb-4 md:mb-6">
              <img 
                src="/images/logo3.png" 
                alt="3N MOBILINDO Logo" 
                className="w-20 h-10 sm:w-24 sm:h-12 md:w-32 md:h-16 mx-auto object-contain mb-2 sm:mb-3 md:mb-4"
              />
            </div>
            
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 leading-tight">
              <span className="text-red-400">3N</span> MOBILINDO
            </h1>
            
            <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl mb-3 sm:mb-4 md:mb-6 text-gray-200 font-medium">
              Premium Car Showroom dengan Koleksi Kendaraan Terbaik
            </p>
            
            <p className="text-xs sm:text-sm md:text-base mb-4 sm:mb-6 md:mb-8 lg:mb-10 text-gray-300 max-w-md mx-auto leading-relaxed px-2 sm:px-0">
              Temukan mobil impian Anda dengan kualitas terbaik dan harga kompetitif. 
              Berbagai pilihan kendaraan dari brand ternama dunia.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center px-4 sm:px-0">
              <Link 
                href="/list-harga" 
                className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-xs sm:text-sm"
              >
                Lihat List Harga
              </Link>
              <Link 
                href="/kontak" 
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-xs sm:text-sm"
              >
                Hubungi Kami
              </Link>
            </div>
          </div>
        </div>
        
        
      </section>

      {/* Featured Cars Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mobil Unggulan
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Pilihan mobil terbaik dengan kualitas premium dan harga terjangkau
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredCars.map((car) => (
              <div key={car.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                <div className="relative h-48 bg-gray-200">
                  {car.image_url ? (
                    <img
                      src={car.image_url}
                      alt={car.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Tersedia
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-red-600 transition-colors duration-300">
                    {car.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 font-medium">Harga</span>
                      <p className="text-2xl font-bold text-red-600">
                        Rp {car.price ? car.price.toLocaleString('id-ID') : '0'}
                      </p>
                    </div>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link
              href="/list-harga"
              className="inline-block bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 font-semibold"
            >
              Lihat Semua Mobil
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mengapa Memilih Kami?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Keunggulan yang membuat kami menjadi pilihan terbaik untuk mobil Anda
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            
            {/* Bergaransi Resmi */}
            <div className="text-center">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Bergaransi Resmi</h3>
              <p className="text-gray-600">Dilengkapi garansi resmi untuk setiap pembelian mobil</p>
            </div>

            {/* Garansi Mesin 3 Bulan */}
            <div className="text-center">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Garansi Mesin 3 Bulan</h3>
              <p className="text-gray-600">Perlindungan mesin selama 3 bulan setelah pembelian</p>
            </div>

            {/* Garansi Kaki-kaki & Kelistrikan 1 Tahun */}
            <div className="text-center">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 17l6-6 4 4 8-8" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Garansi Kaki-kaki & Kelistrikan 1 Tahun</h3>
              <p className="text-gray-600">Perlindungan penuh kaki-kaki dan kelistrikan hingga 1 tahun</p>
            </div>

            {/* Gratis Oli Selama 1 Tahun */}
            <div className="text-center">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v16h16V4H4zm4 4h8v8H8V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Gratis Oli Selama 1 Tahun</h3>
              <p className="text-gray-600">Servis gratis penggantian oli hingga 1 tahun penuh</p>
            </div>

            {/* Free Angsuran Pertama */}
            <div className="text-center">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Free Angsuran Pertama</h3>
              <p className="text-gray-600">Nikmati kemudahan dengan gratis cicilan pertama</p>
            </div>

          </div>
        </div>
      </section>


      {/* Gallery Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Galeri Aktivitas
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Dokumentasi berbagai aktivitas dan event menarik di showroom kami
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredGallery.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-48 bg-gray-200">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.description}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-gray-700">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link
              href="/galeri"
              className="inline-block bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 font-semibold"
            >
              Lihat Semua Galeri
            </Link>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Tentang 3N MOBILINDO
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                3N MOBILINDO adalah showroom mobil premium yang telah berpengalaman lebih dari 10 tahun 
                dalam industri otomotif. Kami berkomitmen untuk memberikan pengalaman terbaik kepada 
                pelanggan dengan koleksi kendaraan berkualitas tinggi dan pelayanan profesional.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Dengan tim yang berpengalaman dan fasilitas modern, kami siap membantu Anda menemukan 
                mobil impian dengan proses yang mudah, aman, dan terpercaya.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/kontak"
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-300 font-semibold text-center"
                >
                  Hubungi Kami
                </Link>
                <Link
                  href="/list-harga"
                  className="bg-transparent border-2 border-red-600 text-red-600 px-6 py-3 rounded-lg hover:bg-red-600 hover:text-white transition-colors duration-300 font-semibold text-center"
                >
                  Lihat Katalog
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-red-600 to-gray-800 rounded-lg p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Keunggulan Kami</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-red-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Koleksi mobil premium dan terpercaya
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-red-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Tim sales profesional dan berpengalaman
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-red-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Proses pembelian mudah dan aman
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-red-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    After sales service yang memuaskan
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
