import { notFound } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface Product {
  id: string
  name: string
  price: string
  stock: number
  isPublished: boolean
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch('http://localhost:3002/api/store/tienda-demo/products/' + id, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  const isOutOfStock = product.stock === 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-8">
        ← Volver a la tienda
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="h-96 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 rounded-2xl flex items-center justify-center">
          <span className="text-9xl opacity-30">📦</span>
        </div>

        <div className="flex flex-col">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>

          <div className="mb-6">
            <span className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              USD {Number(product.price).toFixed(2)}
            </span>
          </div>

          <div className="mb-8">
            <span className={`inline-block text-sm px-4 py-2 rounded-full font-medium ${isOutOfStock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {isOutOfStock ? '❌ Sin stock' : `✅ ${product.stock} disponibles`}
            </span>
          </div>

          <div className="prose prose-lg text-gray-600 mb-8">
            <p>Producto de alta calidad, diseñado para satisfacer tus necesidades. Cada pieza es única y está hecha con los mejores materiales.</p>
          </div>

          <div className="flex gap-4">
            <button 
              className={`flex-1 py-4 rounded-xl font-bold text-lg transition-colors ${isOutOfStock ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? 'No disponible' : '🛒 Agregar al carrito'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}