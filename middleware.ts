import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        }
      }
    }
  )

  // Refresh session nếu hết hạn
  const {
    data: { user }
  } = await supabase.auth.getUser()

  console.log('Middleware - user:', user)

  if (!user) {
    // Chưa login → redirect về auth server
    const authUrl = new URL(
      `${process.env.NEXT_PUBLIC_AUTH_SERVER_URL}/authorize`
    )
    authUrl.searchParams.set('client_id', process.env.SSO_CLIENT_ID!)
    authUrl.searchParams.set(
      'redirect_uri',
      `${process.env.NEXT_PUBLIC_APP_URL}/callback`
    )

    // Giữ lại trang user đang vào để redirect về sau khi login xong
    authUrl.searchParams.set('state', request.nextUrl.pathname)

    return NextResponse.redirect(authUrl)
  }

  return response
}

export const config = {
  matcher: [
    // Bỏ qua các route không cần auth
    '/((?!callback|login-error|_next/static|_next/image|favicon.ico).*)'
  ]
}
