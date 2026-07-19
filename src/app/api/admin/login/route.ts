import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

// Credenciales simples para el MVP (en producción usarías variables de entorno)
const ADMIN_EMAIL = 'admin@vitrina.app'
const ADMIN_PASSWORD = 'admin123'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    if (body.email === ADMIN_EMAIL && body.password === ADMIN_PASSWORD) {
      // Crear cookie de sesión simple (válida por 7 días)
      const cookieStore = await cookies()
      cookieStore.set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 días
        path: '/',
      })

      return NextResponse.json({ success: true, message: 'Login exitoso' })
    } else {
      return NextResponse.json(
        { error: 'Credenciales inválidas' }, 
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('ERROR:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('admin_session')
    return NextResponse.json({ success: true, message: 'Logout exitoso' })
  } catch (error) {
    console.error('ERROR:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}