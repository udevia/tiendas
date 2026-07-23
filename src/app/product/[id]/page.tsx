import { notFound } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getProduct(id: string) {
  try {
    const res = await fetch(`http://localhost:3002/api/store/tienda-demo/products/${id}`, { cache: 'no-store' })
    if (!res.ok) return null
    return await res.json()
  } catch { 
    return null 
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) notFound()

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Link href="/" className="text-purple-600 mb-8 inline-block font-semibold hover:underline">
        ← Volver a la tienda
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="h-96 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center">
          <span className="text-9xl opacity-30">📦</span>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
          <p className="text-5xl font-bold text-purple-600 mb-6">USD {Number(product.price).toFixed(2)}</p>
          <p className="mb-8 text-gray-600 text-lg">
            Stock disponible: <span className="font-bold text-gray-800">{product.stock} unidades</span>.
          </p>
          <button className="bg-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition-colors shadow-lg">
            🛒 Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  )
}