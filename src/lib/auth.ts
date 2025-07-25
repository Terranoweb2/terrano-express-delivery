import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const jwtConfig = {
  secret: new TextEncoder().encode(process.env.JWT_SECRET || 'terrano-express-admin-secret-key'),
  issuer: 'terrano-express',
  audience: 'terrano-admin',
}

export interface AdminUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'manager'
  permissions: string[]
}

// Données admin mockées (en production, viendraient de la DB)
const ADMIN_USERS = [
  {
    email: 'admin@terrano-express.com',
    password: 'admin123', // En production: hash avec bcrypt
    user: {
      id: 'admin-1',
      email: 'admin@terrano-express.com',
      name: 'Administrateur Principal',
      role: 'admin' as const,
      permissions: ['orders', 'reservations', 'customers', 'settings', 'analytics']
    }
  },
  {
    email: 'manager@terrano-express.com',
    password: 'manager123',
    user: {
      id: 'manager-1',
      email: 'manager@terrano-express.com',
      name: 'Manager Restaurant',
      role: 'manager' as const,
      permissions: ['orders', 'reservations', 'customers']
    }
  }
]

export async function createAdminToken(user: AdminUser): Promise<string> {
  return await new SignJWT({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    permissions: user.permissions,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(jwtConfig.issuer)
    .setAudience(jwtConfig.audience)
    .setExpirationTime('24h')
    .setIssuedAt()
    .sign(jwtConfig.secret)
}

export async function verifyAdminToken(token: string): Promise<AdminUser | null> {
  try {
    const { payload } = await jwtVerify(token, jwtConfig.secret, {
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience,
    })

    return {
      id: payload.sub!,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as 'admin' | 'manager',
      permissions: payload.permissions as string[],
    }
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

export async function authenticateAdmin(email: string, password: string): Promise<AdminUser | null> {
  const adminData = ADMIN_USERS.find(admin => admin.email === email)

  if (!adminData || adminData.password !== password) {
    return null
  }

  return adminData.user
}

export async function getAdminSession(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin-token')?.value

    if (!token) {
      return null
    }

    return await verifyAdminToken(token)
  } catch (error) {
    console.error('Session verification failed:', error)
    return null
  }
}

export async function setAdminSession(user: AdminUser): Promise<void> {
  const token = await createAdminToken(user)
  const cookieStore = await cookies()

  cookieStore.set('admin-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60, // 24 hours
    path: '/admin',
  })
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('admin-token')
}

export function requireAdminAuth() {
  return async (request: NextRequest) => {
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    const user = await verifyAdminToken(token)
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Ajouter l'utilisateur à la requête pour l'utiliser dans les pages
    const response = NextResponse.next()
    response.headers.set('x-admin-user', JSON.stringify(user))
    return response
  }
}
