// src/components/Header.tsx
import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-purple-600">
            Vitrina
          </Link>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg">
            🛒 Carrito
          </button>
        </div>
      </div>
    </header>
  )
}