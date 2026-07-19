"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ProductForm from '@/components/ProductForm'

interface Product {
  id: string
  name: string
  price: string
  stock: number
  isPublished: boolean
}

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products`)
        if (res.ok) {
          const products = await res.json()
          const found = products.find((p: Product) => p.id === params.id)
          if (found) {
            setProduct(found)
          } else {
            router.push('/admin')
          }
        }
      } catch {
        console.error('Error cargando producto')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id, router])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-gray-600">Cargando producto...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-red-600">Producto no encontrado</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <ProductForm product={product} mode="edit" />
    </div>
  )
}