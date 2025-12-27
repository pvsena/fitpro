import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected routes under /(app)
  const isAppRoute = request.nextUrl.pathname.startsWith('/dashboard') ||
                     request.nextUrl.pathname.startsWith('/onboarding') ||
                     request.nextUrl.pathname.startsWith('/plan') ||
                     request.nextUrl.pathname.startsWith('/history')

  if (!user && isAppRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redirect logged-in users away from login
  if (user && request.nextUrl.pathname === '/login') {
    const url = request.nextUrl.clone()

    // Check if user has a profile (completed onboarding)
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

    url.pathname = profile ? '/dashboard' : '/onboarding'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
