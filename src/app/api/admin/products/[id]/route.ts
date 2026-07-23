import { NextResponse } from 'next/server'
import { db } from '@/db'
import { products } from '@/db/schema'
import { eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const [updated] = await db.update(products)
      .set({ 
        name: body.name, 
        price: body.price, 
        stock: body.stock, 
        isPublished: body.isPublished 
      })
      .where(eq(products.id, id))
      .returning()

    if (!updated) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json(updated)
  } catch (error) {
    console.error('ERROR PUT:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await db.delete(products).where(eq(products.id, id))
    return NextResponse.json({ message: 'Eliminado' })
  } catch (error) {
    console.error('ERROR DELETE:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}