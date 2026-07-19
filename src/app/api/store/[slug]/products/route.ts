import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    // 🌟 TRUCO DEFINITIVO: Usar require dentro de la función evita que 
    // Next.js/Turbopack intente evaluar Prisma durante el 'next build'
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PrismaClient } = require('@prisma/client')
    const prisma = new PrismaClient()

    const store = await prisma.store.findUnique({
      where: { slug },
      include: { 
        products: { 
          where: { isPublished: true }, 
          orderBy: { createdAt: 'desc' } 
        } 
      }
    })
    
    // Desconectar para evitar fugas de conexión si Next.js lo evalúa
    await prisma.$disconnect()

    if (!store) return NextResponse.json({ error: 'Tienda no encontrada' }, { status: 404 })
    
    return NextResponse.json({ 
      store: { name: store.name, currency: store.currency, slug: store.slug }, 
      products: store.products 
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}