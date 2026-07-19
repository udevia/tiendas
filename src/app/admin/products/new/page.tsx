import ProductForm from '@/components/ProductForm'

export default function NewProductPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <ProductForm mode="create" />
    </div>
  )
}