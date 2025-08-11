import { supabase } from '../../lib/supabase'

async function getCars() {
  const { data: cars, error } = await supabase
    .from('cars')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching cars:', error)
    return []
  }
  
  return cars || []
}

export default async function ListHarga() {
  const cars = await getCars()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            List Harga Mobil
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Temukan mobil impian Anda dengan harga terbaik dan kualitas premium
          </p>
        </div>

        {/* Cars Grid */}
        {cars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car) => (
              <div key={car.id} id={car.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
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
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum ada mobil tersedia</h3>
              <p className="text-gray-600">Silakan cek kembali nanti untuk melihat koleksi mobil terbaru.</p>
            </div>
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-16 bg-gradient-to-r from-red-600 to-gray-800 rounded-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Butuh Bantuan?</h2>
          <p className="text-lg mb-6">
            Tim kami siap membantu Anda menemukan mobil yang tepat sesuai kebutuhan dan budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/kontak"
              className="bg-white text-red-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-300 font-semibold"
            >
              Hubungi Kami
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
