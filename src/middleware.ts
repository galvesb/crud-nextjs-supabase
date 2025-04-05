import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  try {
    // Cria uma resposta que pode ser modificada
    const res = NextResponse.next();

    // Cria o cliente Supabase para o middleware
    const supabase = createMiddlewareClient({ req: request, res });

    // Tenta obter a sessão
    const {
      data: { session },
      error
    } = await supabase.auth.getSession();

    // Se houver erro ao obter a sessão, loga o erro
    if (error) {
      console.error('Erro ao obter sessão:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Rotas protegidas do dashboard
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      if (!session) {
        // Redireciona para login se não houver sessão
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    // Redireciona usuários autenticados para o dashboard se tentarem acessar login/register
    if (session && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return res;
  } catch (e) {
    console.error('Erro no middleware:', e);
    // Em caso de erro, redireciona para login
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
