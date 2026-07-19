import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Usamos una sola conexión para el cliente en producción
const client = postgres(process.env.DATABASE_URL!)
export const db = drizzle(client, { schema })