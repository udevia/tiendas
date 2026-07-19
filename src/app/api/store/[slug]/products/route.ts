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
    
    // 1. Buscar la tienda de forma directa y segura
    const [store] = await db.select().from(stores).where(eq(stores.slug, slug))

    if (!store) {
      return NextResponse.json({ error: 'Tienda no encontrada' }, { status: 404 })
    }

    // 2. Buscar los productos publicados de esa tienda
    const storeProducts = await db.select().from(products)
      .where(and(eq(products.storeId, store.id), eq(products.isPublished, true)))

    return NextResponse.json({ 
      store: { name: store.name, currency: store.currency, slug: store.slug }, 
      products: storeProducts 
    })
  } catch (error) {
    console.error('DRIZZLE ERROR DETALLADO:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}