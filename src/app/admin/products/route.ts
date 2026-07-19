import { NextResponse } from 'next/server'
import { db } from '@/db'
import { products, stores } from '@/db/schema'
import { eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

// GET: Listar todos los productos (para el admin)
export async function GET() {
  try {
    const allProducts = await db.select().from(products).orderBy(products.createdAt)
    return NextResponse.json(allProducts)
  } catch (error) {
    console.error('ERROR:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

// POST: Crear nuevo producto
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Por ahora usamos un storeId hardcodeado (la tienda demo)
    // En producción, esto vendría del usuario autenticado
    const storeId = '00de5d33-f005-4299-af16-682ee2604a81' // ID de la tienda demo
    
    const [newProduct] = await db.insert(products).values({
      id: crypto.randomUUID(),
      storeId,
      name: body.name,
      price: body.price,
      stock: body.stock || 0,
      isPublished: body.isPublished || false,
    }).returning()

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error('ERROR:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}