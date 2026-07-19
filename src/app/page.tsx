import ProductCard from '@/components/ProductCard'

export const dynamic = 'force-dynamic'

interface Product {
  id: string
  name: string
  price: string
  stock: number
}

interface Store {
  name: string
  currency: string
}

export default async function Home() {
  const res = await fetch('http://localhost:3002/api/store/tienda-demo/products', {
    cache: 'no-store',
  })
  
  if (!res.ok) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-xl">Error cargando la tienda</p>
      </div>
    )
  }

  const data = await res.json()

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {data.store.name}
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Productos únicos, calidad garantizada
            </p>
            <a 
              href="#productos" 
              className="inline-block bg-white text-purple-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
            >
              Ver Productos
            </a>
          </div>
        </div>
      </section>

      {/* Productos */}
      <section id="productos" className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Nuestros Productos
          </h2>
          <p className="text-gray-600 text-lg">
            Descubre nuestra selección exclusiva
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.products.map((product: Product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              store={data.store} 
            />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Quieres tu propia tienda online?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Crea tu vitrina digital en minutos
          </p>
          <a 
            href="#" 
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition-opacity"
          >
            Comenzar Gratis
          </a>
        </div>
      </section>
    </>
  )
}