import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '../lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/login-error', request.url))
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_SERVER_URL}/api/exchange`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id: process.env.SSO_CLIENT_ID!,
        client_secret: process.env.SSO_CLIENT_SECRET!
      })
    }
  )

  if (!res.ok) {
    return NextResponse.redirect(
      new URL('/login-error', process.env.NEXT_PUBLIC_APP_URL!)
    )
  }

  const { hashed_token, schema_name } = await res.json()

  // --- Dùng hashed_token để lấy session từ Supabase ---
  const supabase = await createClient()
  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: hashed_token,
    type: 'magiclink'
  })

  if (error || !data.session) {
    return NextResponse.redirect(
      new URL('/login-error', process.env.NEXT_PUBLIC_APP_URL!)
    )
  }

  // --- Redirect về trang chính, lưu schema vào cookie ---
  const response = NextResponse.redirect(new URL('/', request.url))
  response.cookies.set('schema_name', schema_name, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7
  })

  return response
}
