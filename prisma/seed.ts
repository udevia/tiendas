import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  const user = await prisma.user.upsert({
    where: { email: 'admin@vitrina.app' },
    update: {},
    create: {
      email: 'admin@vitrina.app',
      name: 'Admin Vitrina',
      stores: {
        create: {
          name: 'Tienda Demo LATAM',
          slug: 'tienda-demo',
          currency: 'USD',
          products: {
            create: [
              { name: 'Camiseta Premium Personalizable', price: 25.00, stock: 50, isPublished: true },
              { name: 'Taza Cerámica Sublimada', price: 15.50, stock: 100, isPublished: true },
              { name: 'Gorra Bordada', price: 18.00, stock: 0, isPublished: true },
            ],
          },
        },
      },
    },
  })

  console.log('✅ Seed completado exitosamente.')
  console.log(`👤 Usuario creado: ${user.email}`)
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })