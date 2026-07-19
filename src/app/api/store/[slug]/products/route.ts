import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Buscar la tienda y sus productos publicados
    const store = await prisma.store.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isPublished: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!store) {
      return NextResponse.json({ error: 'Tienda no encontrada' }, { status: 404 })
    }

    return NextResponse.json({
      store: { name: store.name, currency: store.currency, slug: store.slug },
      products: store.products,
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}