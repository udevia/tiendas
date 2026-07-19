export default async function Home() {
  // Fetch directo a nuestra API interna (usamos localhost:3002 porque así está expuesto en Docker)
  const res = await fetch('http://localhost:3002/api/store/tienda-demo/products', {
    cache: 'no-store', // Para ver los cambios en tiempo real
  })
  
  const data = await res.json()

  if (!res.ok || !data.store) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600 text-xl">Error cargando la tienda. Verifica que el seed se ejecutó.</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 border-b pb-4">
          <h1 className="text-4xl font-bold text-purple-700">{data.store.name}</h1>
          <p className="text-gray-600 mt-2">Bienvenido a nuestra tienda demo. Moneda: {data.store.currency}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.products.map((product: any) => (
            <div key={product.id} className="bg-white p-6 rounded-xl shadow-md border hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">{product.name}</h2>
              <p className="text-3xl font-bold text-purple-600 mb-4">
                {data.store.currency} {Number(product.price).toFixed(2)}
              </p>
              <div className="flex items-center justify-between mt-4">
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                  product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 0 ? `${product.stock} en stock` : 'Agotado'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}