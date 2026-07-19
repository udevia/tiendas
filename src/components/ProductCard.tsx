import Link from 'next/link'

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

interface ProductCardProps {
  product: Product
  store: Store
}

export default function ProductCard({ product, store }: ProductCardProps) {
  const isOutOfStock = product.stock === 0
  
  return (
    <Link href={`/product/${product.id}`}>
      <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100">
        <div className="h-64 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl opacity-30">📦</span>
          </div>
          {isOutOfStock && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              AGOTADO
            </div>
          )}
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-baseline justify-between mb-4">
            <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              {store.currency} {Number(product.price).toFixed(2)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className={`text-sm px-3 py-1 rounded-full font-medium ${
              isOutOfStock 
                ? 'bg-red-100 text-red-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {isOutOfStock ? 'Sin stock' : `${product.stock} disponibles`}
            </span>
            
            <button 
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                isOutOfStock 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
              disabled={isOutOfStock}
              onClick={(e) => e.preventDefault()}
            >
              {isOutOfStock ? 'No disponible' : 'Agregar 🛒'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}