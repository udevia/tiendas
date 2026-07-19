import { NextResponse } from 'next/server'
import { db } from '@/db'
import { stores, products } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    // Consulta directa, sin binarios, sin magia
    const store = await db.query.stores.findFirst({
      where: eq(stores.slug, slug),
      with: {
        products: {
          where: eq(products.isPublished, true)
        }
      }
    })

    if (!store) {
      return NextResponse.json({ error: 'Tienda no encontrada' }, { status: 404 })
    }

    return NextResponse.json({ store, products: store.products })
  } catch (error) {
    console.error('DB ERROR:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}